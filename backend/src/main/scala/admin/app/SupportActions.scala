package admin.app

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.order.*
import domain.review.*
import domain.shared.*
import shared.app.*

private def findSupportOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)

private def sanitizeSupportResolutionNote(value: ResolutionText): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      value,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.ResolutionNoteRequired,
    )

private def buildOrderChatMessage(
      senderRole: UserRole,
      senderName: PersonName,
      body: DisplayText,
      timestamp: IsoDateTime,
  ): OrderChatMessage =
    OrderChatMessage(
      id = nextId(new DisplayText("chat")),
      senderRole = senderRole,
      senderName = senderName,
      body = body,
      sentAt = timestamp,
    )

private def findRefundOrder(
      current: DeliveryAppState,
      refundId: RefundRequestId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.partialRefundRequests.exists(_.id == refundId)).toRight(ValidationMessages.PartialRefundNotFound)

private def requireRefundableOrder(order: OrderSummary): Either[ErrorMessage, Unit] =
    Either.cond(
      order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
      (),
      ValidationMessages.PartialRefundOrderStatusInvalid,
    )

private def requireResolvableRefundOrder(order: OrderSummary): Either[ErrorMessage, Unit] =
    Either.cond(
      order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
      (),
      ValidationMessages.PartialRefundResolveStatusInvalid,
    )

private def buildPartialRefundRequest(
      order: OrderSummary,
      item: OrderLineItem,
      request: SubmitPartialRefundRequest,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): OrderPartialRefundRequest =
    OrderPartialRefundRequest(
      id = nextId(new DisplayText("prf")),
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

private def reviewPartialRefund(
      partialRefund: OrderPartialRefundRequest,
      approved: ApprovalFlag,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
  ): OrderPartialRefundRequest =
    partialRefund.copy(
      status = if approved then PartialRefundStatus.Approved else PartialRefundStatus.Rejected,
      resolutionNote = Some(resolutionNote),
      reviewedAt = Some(timestamp),
    )

def addOrderChatMessage(
      orderId: OrderId,
      senderRole: UserRole,
      senderName: PersonName,
      request: SendOrderChatMessageRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          _ <- findSupportOrder(current, orderId)
          body <- sanitizeRequiredText(request.body, DeliveryValidationDefaults.OrderChatMessageMaxLength, ValidationMessages.OrderChatMessageRequired)
        yield
          val timestamp = now()
          val message = buildOrderChatMessage(senderRole, senderName, body, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then entry.copy(updatedAt = timestamp, chatMessages = entry.chatMessages :+ message)
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

def ownsPartialRefundRequestAsMerchant(refundId: RefundRequestId, merchantName: PersonName): ApprovalFlag =
    val current = stateRef.get()
    current.orders.exists(order =>
      order.partialRefundRequests.exists(_.id == refundId) &&
        current.stores.exists(store => store.id == order.storeId && store.merchantName == merchantName)
    )

def submitPartialRefundRequest(
      orderId: OrderId,
      request: SubmitPartialRefundRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findSupportOrder(current, orderId)
          _ <- requireRefundableOrder(order)
          item <- order.items.find(_.menuItemId == request.menuItemId).toRight(ValidationMessages.PartialRefundItemMissing)
          _ <- Either.cond(request.quantity > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive, (), ValidationMessages.PartialRefundQuantityInvalid)
          remainingRefundable = item.quantity - item.refundedQuantity - pendingRefundQuantity(order, item.menuItemId)
          _ <- Either.cond(remainingRefundable > NumericDefaults.ZeroQuantity, (), ValidationMessages.PartialRefundQuantityUnavailable)
          _ <- Either.cond(request.quantity <= remainingRefundable, (), partialRefundQuantityExceeded(remainingRefundable))
          reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.PartialRefundReasonRequired)
        yield
          val timestamp = now()
          val partialRefund = buildPartialRefundRequest(order, item, request, reason, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                updatedAt = timestamp,
                partialRefundRequests = entry.partialRefundRequests :+ partialRefund,
                timeline = entry.timeline :+ OrderTimelineEntry(
                  entry.status,
                  renderOrderTimelineMessage(
                    OrderTimelineMessage.PartialRefundRequested(item.name, request.quantity, reason)
                  ),
                  timestamp,
                ),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

def resolvePartialRefundRequest(
      refundId: RefundRequestId,
      request: ResolvePartialRefundRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findRefundOrder(current, refundId)
          partialRefund <- order.partialRefundRequests.find(_.id == refundId).toRight(ValidationMessages.PartialRefundNotFound)
          _ <- Either.cond(partialRefund.status == PartialRefundStatus.Pending, (), ValidationMessages.PartialRefundAlreadyResolved)
          _ <- requireResolvableRefundOrder(order)
          item <- order.items.find(_.menuItemId == partialRefund.menuItemId).toRight(ValidationMessages.PartialRefundItemMissing)
          resolutionNote <- sanitizeSupportResolutionNote(request.resolutionNote)
          remainingQuantityAfterApproval =
            order.items.map(entry => entry.quantity - entry.refundedQuantity).sum -
              (if request.approved then partialRefund.quantity else NumericDefaults.ZeroQuantity)
          _ <- Either.cond(
            !request.approved || remainingQuantityAfterApproval > NumericDefaults.ZeroQuantity,
            (),
            ValidationMessages.PartialRefundWouldEmptyOrder,
          )
          _ <- Either.cond(!request.approved || item.refundedQuantity + partialRefund.quantity <= item.quantity, (), ValidationMessages.PartialRefundQuantityOutOfRange)
        yield
          val timestamp = now()
          val reviewedRefund = reviewPartialRefund(partialRefund, request.approved, resolutionNote, timestamp)
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
              val nextItemSubtotal: CurrencyCents =
                if request.approved then entry.itemSubtotalCents - refundAmountCents else entry.itemSubtotalCents
              val nextTotalPrice: CurrencyCents =
                if request.approved then
                  Math.max(
                    NumericDefaults.ZeroCurrencyCents,
                    nextItemSubtotal + entry.deliveryFeeCents - calculateCouponDiscount(entry.appliedCoupon, nextItemSubtotal, entry.deliveryFeeCents),
                  )
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
                    renderOrderTimelineMessage(
                      OrderTimelineMessage.PartialRefundApproved(
                        partialRefund.itemName,
                        partialRefund.quantity,
                        refundAmountCents,
                        resolutionNote,
                      )
                    )
                  else
                    renderOrderTimelineMessage(
                      OrderTimelineMessage.PartialRefundRejected(
                        partialRefund.itemName,
                        partialRefund.quantity,
                        resolutionNote,
                      )
                    ),
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
