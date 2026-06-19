package services.admin.utils

// Business note: partial-refund request and resolution rules shared by admin refund actions.
import system.objects.given
import services.order.objects.apiTypes.*
import system.app.objects.*

import services.order.objects.*
import system.objects.*
import system.app.*

private[utils] final case class PartialRefundResolutionContext(
    order: OrderSummary,
    partialRefund: OrderPartialRefundRequest,
    item: OrderLineItem,
    resolutionNote: ResolutionText,
)

private[utils] def findRefundOrder(
    current: DeliveryAppState,
    refundId: RefundRequestId,
): Either[ErrorMessage, OrderSummary] =
  current.orders.find(_.partialRefundRequests.exists(_.id == refundId)).toRight(ValidationMessages.AfterSales.PartialRefundNotFound)

private[utils] def requireRefundableOrder(order: OrderSummary): Either[ErrorMessage, Unit] =
  Either.cond(
    order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
    (),
    ValidationMessages.AfterSales.PartialRefundOrderStatusInvalid,
  )

private[utils] def requireResolvableRefundOrder(order: OrderSummary): Either[ErrorMessage, Unit] =
  Either.cond(
    order.status == OrderStatus.PendingMerchantAcceptance || order.status == OrderStatus.Preparing,
    (),
    ValidationMessages.AfterSales.PartialRefundResolveStatusInvalid,
  )

private[utils] def buildPartialRefundRequest(
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

private[utils] def reviewPartialRefund(
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

private[utils] def validatePartialRefundResolution(
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
    resolutionNote <- sanitizeCaseResolutionNote(request.resolutionNote)
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

private[utils] def buildPartialRefundResolutionTimelineEntry(
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

private[utils] def buildResolvedPartialRefundOrder(
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
      maxCurrencyCents(
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

private[utils] def buildCustomersAfterPartialRefundResolution(
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
