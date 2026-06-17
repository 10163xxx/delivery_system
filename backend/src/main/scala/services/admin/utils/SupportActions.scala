package services.admin.utils

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.order.*
import domain.review.*
import domain.shared.*
import system.app.*

private def findSupportOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)

private def sanitizeSupportResolutionNote(value: ResolutionText): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      value,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.AfterSales.ResolutionNoteRequired,
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
    current.orders.find(_.partialRefundRequests.exists(_.id == refundId)).toRight(ValidationMessages.AfterSales.PartialRefundNotFound)

private def requireRefundableOrder(order: OrderSummary): Either[ErrorMessage, Unit] =
    Either.cond(
      order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
      (),
      ValidationMessages.AfterSales.PartialRefundOrderStatusInvalid,
    )

private def requireResolvableRefundOrder(order: OrderSummary): Either[ErrorMessage, Unit] =
    Either.cond(
      order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
      (),
      ValidationMessages.AfterSales.PartialRefundResolveStatusInvalid,
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
      resolution = OrderPartialRefundResolution(
        status = PartialRefundStatus.Pending,
        resolutionNote = None,
        submittedAt = timestamp,
        reviewedAt = None,
      ),
    )

private def reviewPartialRefund(
      partialRefund: OrderPartialRefundRequest,
      approved: ApprovalFlag,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
): OrderPartialRefundRequest =
    partialRefund.copy(
      resolution = partialRefund.resolution.copy(
        status = if approved then PartialRefundStatus.Approved else PartialRefundStatus.Rejected,
        resolutionNote = Some(resolutionNote),
        reviewedAt = Some(timestamp),
      ),
    )

private final case class PartialRefundResolutionContext(
    order: OrderSummary,
    partialRefund: OrderPartialRefundRequest,
    item: OrderLineItem,
    resolutionNote: ResolutionText,
)

private def validatePartialRefundResolution(
      current: DeliveryAppState,
      refundId: RefundRequestId,
      request: ResolvePartialRefundRequest,
  ): Either[ErrorMessage, PartialRefundResolutionContext] =
    for
      order <- findRefundOrder(current, refundId)
      partialRefund <- order.partialRefundRequests.find(_.id == refundId).toRight(ValidationMessages.AfterSales.PartialRefundNotFound)
      _ <- Either.cond(partialRefund.status == PartialRefundStatus.Pending, (), ValidationMessages.AfterSales.PartialRefundAlreadyResolved)
      _ <- requireResolvableRefundOrder(order)
      item <- order.items.find(_.menuItemId == partialRefund.menuItemId).toRight(ValidationMessages.AfterSales.PartialRefundItemMissing)
      resolutionNote <- sanitizeSupportResolutionNote(request.resolutionNote)
      remainingQuantityAfterApproval =
        order.items.map(entry => entry.quantity - entry.refundedQuantity).sum -
          (if request.approved then partialRefund.quantity else NumericDefaults.ZeroQuantity)
      _ <- Either.cond(
        !request.approved || remainingQuantityAfterApproval > NumericDefaults.ZeroQuantity,
        (),
        ValidationMessages.AfterSales.PartialRefundWouldEmptyOrder,
      )
      _ <- Either.cond(!request.approved || item.refundedQuantity + partialRefund.quantity <= item.quantity, (), ValidationMessages.AfterSales.PartialRefundQuantityOutOfRange)
    yield PartialRefundResolutionContext(
      order = order,
      partialRefund = partialRefund,
      item = item,
      resolutionNote = resolutionNote,
    )

private def buildPartialRefundResolutionTimelineEntry(
      context: PartialRefundResolutionContext,
      approved: ApprovalFlag,
      refundAmountCents: CurrencyCents,
      timestamp: IsoDateTime,
  ): OrderTimelineEntry =
    val message =
      if approved then
        OrderTimelineMessage.PartialRefundApproved(
          context.partialRefund.itemName,
          context.partialRefund.quantity,
          refundAmountCents,
          context.resolutionNote,
        )
      else
        OrderTimelineMessage.PartialRefundRejected(
          context.partialRefund.itemName,
          context.partialRefund.quantity,
          context.resolutionNote,
        )

    OrderTimelineEntry(
      context.order.status,
      renderOrderTimelineMessage(message),
      timestamp,
    )

private def buildResolvedPartialRefundOrder(
      entry: OrderSummary,
      context: PartialRefundResolutionContext,
      reviewedRefund: OrderPartialRefundRequest,
      approved: ApprovalFlag,
      refundAmountCents: CurrencyCents,
      timestamp: IsoDateTime,
  ): OrderSummary =
    val nextItems =
      if approved then
        entry.items.map(lineItem =>
          if lineItem.menuItemId == context.partialRefund.menuItemId then
            lineItem.copy(refundedQuantity = lineItem.refundedQuantity + context.partialRefund.quantity)
          else lineItem
        )
      else entry.items
    val nextItemSubtotal: CurrencyCents =
      if approved then entry.itemSubtotalCents - refundAmountCents else entry.itemSubtotalCents
    val nextCouponDiscountCents =
      if approved then calculateCouponDiscount(entry.appliedCoupon, nextItemSubtotal, entry.deliveryFeeCents)
      else entry.couponDiscountCents
    val nextTotalPrice: CurrencyCents =
      if approved then
        Math.max(
          NumericDefaults.ZeroCurrencyCents,
          nextItemSubtotal + entry.deliveryFeeCents - nextCouponDiscountCents,
        )
      else entry.totalPriceCents

    entry.copy(
      fulfillment = entry.fulfillment.copy(items = nextItems),
      pricing = entry.pricing.copy(
        itemSubtotalCents = nextItemSubtotal,
        couponDiscountCents = nextCouponDiscountCents,
        totalPriceCents = nextTotalPrice,
      ),
      lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
      activity = entry.activity.copy(
        partialRefundRequests = entry.partialRefundRequests.map(existing =>
          if existing.id == reviewedRefund.id then reviewedRefund else existing
        ),
        timeline = entry.timeline :+ buildPartialRefundResolutionTimelineEntry(
          context,
          approved,
          refundAmountCents,
          timestamp,
        ),
      ),
    )

private def buildCustomersAfterPartialRefundResolution(
      current: DeliveryAppState,
      context: PartialRefundResolutionContext,
      approved: ApprovalFlag,
      refundAmountCents: CurrencyCents,
  ) =
    if approved then
      current.customers.map(customer =>
        if customer.id == context.order.customerId then
          customer.copy(
            metrics = customer.metrics.copy(
              balanceCents = customer.balanceCents + refundAmountCents
            )
          )
        else customer
      )
    else current.customers

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
          body <- sanitizeRequiredText(request.body, DeliveryValidationDefaults.OrderChatMessageMaxLength, ValidationMessages.Order.OrderChatMessageRequired)
        yield
          val timestamp = now()
          val message = buildOrderChatMessage(senderRole, senderName, body, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
                activity = entry.activity.copy(chatMessages = entry.chatMessages :+ message),
              )
            else entry
          )
          withDerivedData(current.copy(deliveryState = current.deliveryState.copy(orders = nextOrders)))
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
          item <- order.items.find(_.menuItemId == request.menuItemId).toRight(ValidationMessages.AfterSales.PartialRefundItemMissing)
          _ <- Either.cond(request.quantity > DeliveryValidationDefaults.MenuItemPriceMinCentsExclusive, (), ValidationMessages.AfterSales.PartialRefundQuantityInvalid)
          remainingRefundable = item.quantity - item.refundedQuantity - pendingRefundQuantity(order, item.menuItemId)
          _ <- Either.cond(remainingRefundable > NumericDefaults.ZeroQuantity, (), ValidationMessages.AfterSales.PartialRefundQuantityUnavailable)
          _ <- Either.cond(request.quantity <= remainingRefundable, (), partialRefundQuantityExceeded(remainingRefundable))
          reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.AfterSales.PartialRefundReasonRequired)
        yield
          val timestamp = now()
          val partialRefund = buildPartialRefundRequest(order, item, request, reason, timestamp)
          val nextOrders = current.orders.map(entry =>
            if entry.id == order.id then
              entry.copy(
                lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
                activity = entry.activity.copy(
                  partialRefundRequests = entry.partialRefundRequests :+ partialRefund,
                  timeline = entry.timeline :+ OrderTimelineEntry(
                    entry.status,
                    renderOrderTimelineMessage(
                      OrderTimelineMessage.PartialRefundRequested(item.name, request.quantity, reason)
                    ),
                    timestamp,
                  ),
                ),
              )
            else entry
          )
          withDerivedData(current.copy(deliveryState = current.deliveryState.copy(orders = nextOrders)))
      }
    }

def resolvePartialRefundRequest(
      refundId: RefundRequestId,
      request: ResolvePartialRefundRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          context <- validatePartialRefundResolution(current, refundId, request)
        yield
          val timestamp = now()
          val reviewedRefund = reviewPartialRefund(
            context.partialRefund,
            request.approved,
            context.resolutionNote,
            timestamp,
          )
          val refundAmountCents = context.partialRefund.quantity * context.item.unitPriceCents
          val nextOrders = current.orders.map(entry =>
            if entry.id == context.order.id then
              buildResolvedPartialRefundOrder(
                entry,
                context,
                reviewedRefund,
                request.approved,
                refundAmountCents,
                timestamp,
              )
            else entry
          )
          val nextCustomers = buildCustomersAfterPartialRefundResolution(
            current,
            context,
            request.approved,
            refundAmountCents,
          )
          withDerivedData(
            current.copy(
              customers = nextCustomers,
              deliveryState = current.deliveryState.copy(orders = nextOrders),
            )
          )
      }
    }
