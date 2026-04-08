package app.delivery

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.order.*
import domain.review.*
import domain.shared.*

def resolveAfterSalesTicket(
      ticketId: String,
      request: ResolveAfterSalesRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          ticket <- current.tickets.find(_.id == ticketId).toRight(ValidationMessages.AfterSalesTicketNotFound)
          _ <- Either.cond(ticket.kind == TicketKind.DeliveryIssue, (), ValidationMessages.TicketIsNotAfterSalesRequest)
          _ <- Either.cond(ticket.status == TicketStatus.Open, (), ValidationMessages.AfterSalesAlreadyResolved)
          order <- current.orders.find(_.id == ticket.orderId).toRight(ValidationMessages.RelatedOrderNotFound)
          customer <- current.customers.find(_.id == order.customerId).toRight(ValidationMessages.RelatedCustomerNotFound)
          requestType <- ticket.requestType.toRight(ValidationMessages.MissingAfterSalesRequestType)
          resolutionNote <- sanitizeRequiredText(request.resolutionNote, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.ResolutionNoteRequired)
          resolutionMode =
            if request.approved then request.resolutionMode.getOrElse(AfterSalesResolutionMode.Balance)
            else AfterSalesResolutionMode.Manual
          creditedAmount <-
            if request.approved then
              resolutionMode match
                case AfterSalesResolutionMode.Manual =>
                  Right(0)
                case AfterSalesResolutionMode.Balance | AfterSalesResolutionMode.Coupon =>
                  requestType match
                    case AfterSalesRequestType.ReturnRequest =>
                      val amount = request.actualCompensationCents.getOrElse(order.totalPriceCents)
                      Either.cond(amount > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive, amount, ValidationMessages.RefundAmountMustBePositive)
                    case AfterSalesRequestType.CompensationRequest =>
                      val amount = request.actualCompensationCents.orElse(ticket.expectedCompensationCents)
                      amount match
                        case Some(value) if value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive => Right(value)
                        case Some(_) => Left(ValidationMessages.CompensationAmountMustBePositive)
                        case None => Left(ValidationMessages.CompensationAmountRequired)
            else Right(0)
        yield
          val timestamp = now()
          val issuedCoupon =
            if request.approved && resolutionMode == AfterSalesResolutionMode.Coupon then
              Some(buildAfterSalesCoupon(customer.id, requestType, creditedAmount, timestamp))
            else None
          val outcomeNote =
            if request.approved then
              resolutionMode match
                case AfterSalesResolutionMode.Balance =>
                  requestType match
                    case AfterSalesRequestType.ReturnRequest =>
                      s"管理员已同意退货售后，退款 ${formatCurrency(creditedAmount)} 已退回顾客余额。$resolutionNote"
                    case AfterSalesRequestType.CompensationRequest =>
                      s"管理员已同意赔偿售后，赔偿 ${formatCurrency(creditedAmount)} 已发放至顾客余额。$resolutionNote"
                case AfterSalesResolutionMode.Coupon =>
                  val coupon = issuedCoupon.get
                  s"管理员已同意售后申请，已补发优惠券 ${coupon.title}（${formatCurrency(coupon.discountCents)}，无门槛可用）。$resolutionNote"
                case AfterSalesResolutionMode.Manual =>
                  s"管理员已同意售后申请，本次不发放退款或优惠券。$resolutionNote"
            else s"管理员已驳回售后申请：$resolutionNote"
          val nextCustomers =
            current.customers.map(entry =>
              if entry.id == customer.id then
                resolutionMode match
                  case AfterSalesResolutionMode.Balance if request.approved && creditedAmount > 0 =>
                    entry.copy(balanceCents = entry.balanceCents + creditedAmount)
                  case AfterSalesResolutionMode.Coupon if request.approved =>
                    entry.copy(coupons = issuedCoupon.toList ++ entry.coupons)
                  case _ => entry
              else entry
            )
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(entry.status, outcomeNote, timestamp),
              )
            else entry
          )
          val nextTickets = current.tickets.map(entry =>
            if entry.id == ticket.id then
              entry.copy(
                status = TicketStatus.Resolved,
                approved = Some(request.approved),
                actualCompensationCents = if request.approved && creditedAmount > 0 then Some(creditedAmount) else None,
                resolutionMode = if request.approved then Some(resolutionMode) else Some(AfterSalesResolutionMode.Manual),
                issuedCoupon = issuedCoupon,
                resolutionNote = Some(resolutionNote),
                reviewedAt = Some(timestamp),
                updatedAt = timestamp,
              )
            else entry
          )
          withDerivedData(current.copy(customers = nextCustomers, orders = nextOrders, tickets = nextTickets))
      }
    }

def submitAfterSalesRequest(
      orderId: String,
      request: SubmitAfterSalesRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(
            !current.tickets.exists(ticket =>
              ticket.orderId == orderId &&
              ticket.kind == TicketKind.DeliveryIssue &&
              ticket.status == TicketStatus.Open,
            ),
            (),
            ValidationMessages.PendingAfterSalesExists,
          )
          reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.AfterSalesReasonRequired)
          expectedCompensationCents <-
            request.expectedCompensationCents match
              case Some(value) => Either.cond(value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive, Some(value), ValidationMessages.ExpectedCompensationMustBePositive)
              case None =>
                Either.cond(request.requestType != AfterSalesRequestType.CompensationRequest, None, ValidationMessages.ExpectedCompensationRequired)
        yield
          val timestamp = now()
          val summary = request.requestType match
            case AfterSalesRequestType.ReturnRequest =>
              s"顾客申请退货售后：$reason"
            case AfterSalesRequestType.CompensationRequest =>
              val amountText = expectedCompensationCents.map(cents => f"${cents / 100.0}%.2f 元").getOrElse("未填写金额")
              s"顾客申请赔偿售后（期望 $amountText）：$reason"
          val ticket = AdminTicket(
            id = nextId("ticket"),
            orderId = order.id,
            kind = TicketKind.DeliveryIssue,
            status = TicketStatus.Open,
            summary = summary,
            requestType = Some(request.requestType),
            submittedByRole = Some(UserRole.customer),
            submittedByName = Some(order.customerName),
            expectedCompensationCents = expectedCompensationCents,
            actualCompensationCents = None,
            approved = None,
            resolutionMode = None,
            issuedCoupon = None,
            submittedAt = timestamp,
            reviewedAt = None,
            resolutionNote = None,
            updatedAt = timestamp,
          )
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(entry.status, "顾客已提交售后申请，等待管理员处理", timestamp),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders, tickets = ticket :: current.tickets))
      }
    }

def addOrderChatMessage(
      orderId: String,
      senderRole: UserRole,
      senderName: String,
      request: SendOrderChatMessageRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          _ <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          body <- sanitizeRequiredText(request.body, DeliveryValidationDefaults.OrderChatMessageMaxLength, ValidationMessages.OrderChatMessageRequired)
        yield
          val timestamp = now()
          val message = OrderChatMessage(
            id = nextId("chat"),
            senderRole = senderRole,
            senderName = senderName,
            body = body,
            sentAt = timestamp,
          )
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then entry.copy(updatedAt = timestamp, chatMessages = entry.chatMessages :+ message)
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

def ownsPartialRefundRequestAsMerchant(refundId: String, merchantName: String): Boolean =
    val current = stateRef.get()
    current.orders.exists(order =>
      order.partialRefundRequests.exists(_.id == refundId) &&
        current.stores.exists(store => store.id == order.storeId && store.merchantName == merchantName)
    )

def submitPartialRefundRequest(
      orderId: String,
      request: SubmitPartialRefundRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(
            order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
            (),
            ValidationMessages.PartialRefundOrderStatusInvalid,
          )
          item <- order.items.find(_.menuItemId == request.menuItemId).toRight(ValidationMessages.PartialRefundItemMissing)
          _ <- Either.cond(request.quantity > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive, (), ValidationMessages.PartialRefundQuantityInvalid)
          remainingRefundable = item.quantity - item.refundedQuantity - pendingRefundQuantity(order, item.menuItemId)
          _ <- Either.cond(remainingRefundable > 0, (), ValidationMessages.PartialRefundQuantityUnavailable)
          _ <- Either.cond(request.quantity <= remainingRefundable, (), ValidationMessages.partialRefundQuantityExceeded(remainingRefundable))
          reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.PartialRefundReasonRequired)
        yield
          val timestamp = now()
          val partialRefund = OrderPartialRefundRequest(
            id = nextId("prf"),
            orderId = order.id,
            menuItemId = item.menuItemId,
            itemName = item.name,
            quantity = request.quantity,
            reason = reason,
            status = PartialRefundStatus.Pending,
            resolutionNote = None,
            submittedAt = timestamp,
            reviewedAt = None,
          )
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                updatedAt = timestamp,
                partialRefundRequests = entry.partialRefundRequests :+ partialRefund,
                timeline = entry.timeline :+ OrderTimelineEntry(entry.status, s"顾客申请退掉 ${item.name} x ${request.quantity}，原因：$reason", timestamp),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

def resolvePartialRefundRequest(
      refundId: String,
      request: ResolvePartialRefundRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.partialRefundRequests.exists(_.id == refundId)).toRight(ValidationMessages.PartialRefundNotFound)
          partialRefund <- order.partialRefundRequests.find(_.id == refundId).toRight(ValidationMessages.PartialRefundNotFound)
          _ <- Either.cond(partialRefund.status == PartialRefundStatus.Pending, (), ValidationMessages.PartialRefundAlreadyResolved)
          _ <- Either.cond(
            order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
            (),
            ValidationMessages.PartialRefundResolveStatusInvalid,
          )
          item <- order.items.find(_.menuItemId == partialRefund.menuItemId).toRight(ValidationMessages.PartialRefundItemMissing)
          resolutionNote <- sanitizeRequiredText(request.resolutionNote, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.ResolutionNoteRequired)
          remainingQuantityAfterApproval =
            order.items.map(entry => entry.quantity - entry.refundedQuantity).sum - (if request.approved then partialRefund.quantity else 0)
          _ <- Either.cond(!request.approved || remainingQuantityAfterApproval > 0, (), ValidationMessages.PartialRefundWouldEmptyOrder)
          _ <- Either.cond(!request.approved || item.refundedQuantity + partialRefund.quantity <= item.quantity, (), ValidationMessages.PartialRefundQuantityOutOfRange)
        yield
          val timestamp = now()
          val reviewedRefund = partialRefund.copy(
            status = if request.approved then PartialRefundStatus.Approved else PartialRefundStatus.Rejected,
            resolutionNote = Some(resolutionNote),
            reviewedAt = Some(timestamp),
          )
          val refundAmountCents = partialRefund.quantity * item.unitPriceCents
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              val nextItems =
                if request.approved then
                  entry.items.map(lineItem =>
                    if lineItem.menuItemId == partialRefund.menuItemId then
                      lineItem.copy(refundedQuantity = lineItem.refundedQuantity + partialRefund.quantity)
                    else lineItem
                  )
                else entry.items
              val nextItemSubtotal = if request.approved then entry.itemSubtotalCents - refundAmountCents else entry.itemSubtotalCents
              val nextTotalPrice =
                if request.approved then
                  Math.max(0, nextItemSubtotal + entry.deliveryFeeCents - calculateCouponDiscount(entry.appliedCoupon, nextItemSubtotal, entry.deliveryFeeCents))
                else entry.totalPriceCents
              val nextCouponDiscountCents =
                if request.approved then calculateCouponDiscount(entry.appliedCoupon, nextItemSubtotal, entry.deliveryFeeCents)
                else entry.couponDiscountCents
              entry.copy(
                items = nextItems,
                itemSubtotalCents = nextItemSubtotal,
                couponDiscountCents = nextCouponDiscountCents,
                totalPriceCents = nextTotalPrice,
                updatedAt = timestamp,
                partialRefundRequests = entry.partialRefundRequests.map(existing =>
                  if existing.id == reviewedRefund.id then reviewedRefund else existing
                ),
                timeline = entry.timeline :+ OrderTimelineEntry(
                  entry.status,
                  if request.approved then
                    f"商家同意退掉 ${partialRefund.itemName} x ${partialRefund.quantity}，已退款 ${refundAmountCents / 100.0}%.2f 元：$resolutionNote"
                  else s"商家拒绝退掉 ${partialRefund.itemName} x ${partialRefund.quantity}：$resolutionNote",
                  timestamp,
                ),
              )
            else entry
          )
          val nextCustomers =
            if request.approved then
              current.customers.map(customer =>
                if customer.id == order.customerId then customer.copy(balanceCents = customer.balanceCents + refundAmountCents)
                else customer
              )
            else current.customers
          withDerivedData(current.copy(orders = nextOrders, customers = nextCustomers))
      }
    }
