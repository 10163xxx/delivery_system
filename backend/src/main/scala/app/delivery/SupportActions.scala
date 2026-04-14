package app.delivery

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.customer.*
import domain.order.*
import domain.review.*
import domain.shared.*

private case class AfterSalesResolutionContext(
      request: ResolveAfterSalesRequest,
      ticket: AdminTicket,
      order: OrderSummary,
      requestType: AfterSalesRequestType,
      resolutionMode: AfterSalesResolutionMode,
  )

private def findAfterSalesTicket(
      current: DeliveryAppState,
      ticketId: TicketId,
  ): Either[ErrorMessage, AdminTicket] =
    current.tickets.find(_.id == ticketId).toRight(ValidationMessages.AfterSalesTicketNotFound)

private def requireAfterSalesTicket(ticket: AdminTicket): Either[ErrorMessage, Unit] =
    Either.cond(ticket.kind == TicketKind.DeliveryIssue, (), ValidationMessages.TicketIsNotAfterSalesRequest)

private def requireOpenAfterSalesTicket(ticket: AdminTicket): Either[ErrorMessage, Unit] =
    Either.cond(ticket.status == TicketStatus.Open, (), ValidationMessages.AfterSalesAlreadyResolved)

private def findSupportOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)

private def findSupportOrderByTicket(
      current: DeliveryAppState,
      ticket: AdminTicket,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == ticket.orderId).toRight(ValidationMessages.RelatedOrderNotFound)

private def findRelatedCustomer(
      current: DeliveryAppState,
      order: OrderSummary,
  ): Either[ErrorMessage, Customer] =
    current.customers.find(_.id == order.customerId).toRight(ValidationMessages.RelatedCustomerNotFound)

private def sanitizeSupportResolutionNote(value: ResolutionText): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      value,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.ResolutionNoteRequired,
    )

private def hasPendingAfterSalesTicket(
      current: DeliveryAppState,
      orderId: OrderId,
  ): ApprovalFlag =
    current.tickets.exists(ticket =>
      ticket.orderId == orderId &&
        ticket.kind == TicketKind.DeliveryIssue &&
        ticket.status == TicketStatus.Open
    )

private def sanitizeAfterSalesReason(reason: ReasonText): Either[ErrorMessage, ReasonText] =
    sanitizeRequiredText(
      reason,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.AfterSalesReasonRequired,
    )

private def validateExpectedCompensation(
      request: SubmitAfterSalesRequest
  ): Either[ErrorMessage, Option[CurrencyCents]] =
    request.expectedCompensationCents match
      case Some(value) =>
        Either.cond(
          value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive,
          Some(value),
          ValidationMessages.ExpectedCompensationMustBePositive,
        )
      case None =>
        Either.cond(
          request.requestType != AfterSalesRequestType.CompensationRequest,
          None,
          ValidationMessages.ExpectedCompensationRequired,
        )

private def resolveAfterSalesMode(request: ResolveAfterSalesRequest): AfterSalesResolutionMode =
    if request.approved then request.resolutionMode.getOrElse(AfterSalesResolutionMode.Balance)
    else AfterSalesResolutionMode.Manual

private def resolveCreditedAmount(
      context: AfterSalesResolutionContext,
  ): Either[ErrorMessage, CurrencyCents] =
    if !context.request.approved then Right(NumericDefaults.ZeroCurrencyCents)
    else
      context.resolutionMode match
        case AfterSalesResolutionMode.Manual =>
          Right(NumericDefaults.ZeroCurrencyCents)
        case AfterSalesResolutionMode.Balance | AfterSalesResolutionMode.Coupon =>
          context.requestType match
            case AfterSalesRequestType.ReturnRequest =>
              val amount = context.request.actualCompensationCents.getOrElse(context.order.totalPriceCents)
              Either.cond(
                amount > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive,
                amount,
                ValidationMessages.RefundAmountMustBePositive,
              )
            case AfterSalesRequestType.CompensationRequest =>
              context.request.actualCompensationCents.orElse(context.ticket.expectedCompensationCents) match
                case Some(value) if value > DeliveryValidationDefaults.CompensationAmountMinCentsExclusive =>
                  Right(value)
                case Some(_) =>
                  Left(ValidationMessages.CompensationAmountMustBePositive)
                case None =>
                  Left(ValidationMessages.CompensationAmountRequired)

private def buildAfterSalesOutcomeNote(
      requestType: AfterSalesRequestType,
      approved: ApprovalFlag,
      resolutionMode: AfterSalesResolutionMode,
      creditedAmount: CurrencyCents,
      issuedCoupon: Option[Coupon],
      resolutionNote: ResolutionText,
  ): DisplayText =
    if !approved then renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.Rejected(resolutionNote))
    else
      resolutionMode match
        case AfterSalesResolutionMode.Balance =>
          requestType match
            case AfterSalesRequestType.ReturnRequest =>
              renderAfterSalesOutcomeMessage(
                AfterSalesOutcomeMessage.ReturnToBalance(creditedAmount, resolutionNote)
              )
            case AfterSalesRequestType.CompensationRequest =>
              renderAfterSalesOutcomeMessage(
                AfterSalesOutcomeMessage.CompensationToBalance(creditedAmount, resolutionNote)
              )
        case AfterSalesResolutionMode.Coupon =>
          val coupon = issuedCoupon.get
          renderAfterSalesOutcomeMessage(
            AfterSalesOutcomeMessage.CouponIssued(coupon.title, coupon.discountCents, resolutionNote)
          )
        case AfterSalesResolutionMode.Manual =>
          renderAfterSalesOutcomeMessage(AfterSalesOutcomeMessage.ManualApproved(resolutionNote))

private def updateAfterSalesCustomer(
      customer: Customer,
      approved: ApprovalFlag,
      resolutionMode: AfterSalesResolutionMode,
      creditedAmount: CurrencyCents,
      issuedCoupon: Option[Coupon],
  ): Customer =
    resolutionMode match
      case AfterSalesResolutionMode.Balance if approved && creditedAmount > NumericDefaults.ZeroCurrencyCents =>
        customer.copy(balanceCents = customer.balanceCents + creditedAmount)
      case AfterSalesResolutionMode.Coupon if approved =>
        customer.copy(coupons = issuedCoupon.toList ++ customer.coupons)
      case _ =>
        customer

private def buildAfterSalesTicketSummary(
      requestType: AfterSalesRequestType,
      reason: ReasonText,
      expectedCompensationCents: Option[CurrencyCents],
  ): SummaryText =
    requestType match
      case AfterSalesRequestType.ReturnRequest =>
        renderAfterSalesTicketSummary(AfterSalesTicketSummaryMessage.ReturnRequest(reason))
      case AfterSalesRequestType.CompensationRequest =>
        renderAfterSalesTicketSummary(
          AfterSalesTicketSummaryMessage.CompensationRequest(reason, expectedCompensationCents)
        )

private def buildAfterSalesTicket(
      order: OrderSummary,
      request: SubmitAfterSalesRequest,
      reason: ReasonText,
      expectedCompensationCents: Option[CurrencyCents],
      timestamp: IsoDateTime,
  ): AdminTicket =
    AdminTicket(
      id = nextId(new DisplayText("ticket")),
      orderId = order.id,
      kind = TicketKind.DeliveryIssue,
      status = TicketStatus.Open,
      summary = buildAfterSalesTicketSummary(request.requestType, reason, expectedCompensationCents),
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

def resolveAfterSalesTicket(
      ticketId: TicketId,
      request: ResolveAfterSalesRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          ticket <- findAfterSalesTicket(current, ticketId)
          _ <- requireAfterSalesTicket(ticket)
          _ <- requireOpenAfterSalesTicket(ticket)
          order <- findSupportOrderByTicket(current, ticket)
          customer <- findRelatedCustomer(current, order)
          requestType <- ticket.requestType.toRight(ValidationMessages.MissingAfterSalesRequestType)
          resolutionNote <- sanitizeSupportResolutionNote(request.resolutionNote)
          resolutionMode = resolveAfterSalesMode(request)
          creditedAmount <- resolveCreditedAmount(
            AfterSalesResolutionContext(request, ticket, order, requestType, resolutionMode)
          )
        yield
          val timestamp = now()
          val issuedCoupon =
            if request.approved && resolutionMode == AfterSalesResolutionMode.Coupon then
              Some(buildAfterSalesCoupon(customer.id, requestType, creditedAmount, timestamp))
            else None
          val outcomeNote =
            buildAfterSalesOutcomeNote(
              requestType,
              request.approved,
              resolutionMode,
              creditedAmount,
              issuedCoupon,
              resolutionNote,
            )
          val nextCustomers =
            current.customers.map(entry =>
              if entry.id == customer.id then
                updateAfterSalesCustomer(entry, request.approved, resolutionMode, creditedAmount, issuedCoupon)
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
                actualCompensationCents =
                  if request.approved && creditedAmount > NumericDefaults.ZeroCurrencyCents then Some(creditedAmount) else None,
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
      orderId: OrderId,
      request: SubmitAfterSalesRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findSupportOrder(current, orderId)
          _ <- Either.cond(!hasPendingAfterSalesTicket(current, orderId), (), ValidationMessages.PendingAfterSalesExists)
          reason <- sanitizeAfterSalesReason(request.reason)
          expectedCompensationCents <- validateExpectedCompensation(request)
        yield
          val timestamp = now()
          val ticket = buildAfterSalesTicket(order, request, reason, expectedCompensationCents, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(
                  entry.status,
                  renderOrderTimelineMessage(OrderTimelineMessage.AfterSalesSubmitted),
                  timestamp,
                ),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders, tickets = ticket :: current.tickets))
      }
    }

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
