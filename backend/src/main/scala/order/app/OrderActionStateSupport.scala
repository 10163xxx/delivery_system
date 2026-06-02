package order.app

import domain.shared.given

import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.shared.*
import shared.app.*

def validateCreateOrderRequest(
    current: DeliveryAppState,
    request: CreateOrderRequest,
): Either[ErrorMessage, CreateOrderContext] =
  for
    customer <- findOrderCustomer(current, request.customerId)
    _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), ValidationMessages.Customer.CustomerAccountSuspended)
    store <- findOrderStore(current, request.storeId)
    _ <- Either.cond(store.status != StoreRevokedStatus, (), ValidationMessages.Merchant.StoreRevoked)
    storeLocation <- store.location.toRight(ValidationMessages.Order.StoreLocationRequired)
    timestamp = now()
    _ <- Either.cond(isStoreOpenAt(store, timestamp), (), storeCurrentlyClosed(formatBusinessHours(store.businessHours)))
    items <- buildLineItems(store, request.items)
    deliveryAddress <- sanitizeRequiredText(request.deliveryAddress, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.Order.DeliveryAddressRequired)
    addressEntry <- customer.addresses.find(_.address == deliveryAddress).toRight(ValidationMessages.Customer.AddressNotFound)
    deliveryLocation <- addressEntry.location.toRight(ValidationMessages.Customer.AddressLocationRequired)
    deliveryQuote = buildStoreDeliveryQuote(storeLocation, deliveryLocation)
    _ <- Either.cond(deliveryQuote.isDeliverable, (), ValidationMessages.Order.DeliveryDistanceOutOfRange)
    scheduledDeliveryAt <- validateScheduledDeliveryAt(request.scheduledDeliveryAt, timestamp)
    itemSubtotalCents = lineItemSubtotalCents(items)
    appliedCoupon <- validateOrderCoupon(customer, request.couponId, itemSubtotalCents)
    priceBreakdown = calculateOrderPriceBreakdown(itemSubtotalCents, appliedCoupon, deliveryQuote.deliveryFeeCents)
    _ <- Either.cond(customer.balanceCents >= priceBreakdown.totalPriceCents, (), ValidationMessages.Order.InsufficientBalanceForOrder)
  yield CreateOrderContext(
    customer = customer,
    store = store,
    timestamp = timestamp,
    items = items,
    deliveryAddress = deliveryAddress,
    deliveryFeeCents = deliveryQuote.deliveryFeeCents,
    scheduledDeliveryAt = scheduledDeliveryAt,
    appliedCoupon = appliedCoupon,
    priceBreakdown = priceBreakdown,
    remark = sanitizeOptionalText(request.remark, DeliveryValidationDefaults.OrderRemarkMaxLength),
  )

def applyCreatedOrderState(
    current: DeliveryAppState,
    context: CreateOrderContext,
): DeliveryAppState =
  val order = createPendingOrder(
    customer = context.customer,
    store = context.store,
    deliveryAddress = context.deliveryAddress,
    deliveryFeeCents = context.deliveryFeeCents,
    scheduledDeliveryAt = context.scheduledDeliveryAt,
    remark = context.remark,
    items = context.items,
    appliedCoupon = context.appliedCoupon,
    priceBreakdown = context.priceBreakdown,
    timestamp = context.timestamp,
  )
  withDerivedData(
    current.copy(
      stores = current.stores.map(entry =>
        if entry.id == context.store.id then reserveOrderStock(entry, context.items) else entry
      ),
      customers = current.customers.map(entry =>
        if entry.id == context.customer.id then
          chargeOrderCustomer(entry, context.priceBreakdown.totalPriceCents, context.appliedCoupon)
        else entry
      ),
      deliveryState = current.deliveryState.copy(orders = order :: current.orders),
    )
  )

def validateRejectOrderRequest(
    current: DeliveryAppState,
    orderId: OrderId,
    request: RejectOrderRequest,
): Either[ErrorMessage, RejectOrderContext] =
  for
    order <- findOrder(current, orderId)
    _ <- requireOrderStatus(order, OrderStatus.PendingMerchantAcceptance, ValidationMessages.Order.OrderCannotReject)
    reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.Order.RejectOrderReasonRequired)
  yield RejectOrderContext(order = order, reason = reason, timestamp = now())

def applyRejectedOrderState(
    current: DeliveryAppState,
    orderId: OrderId,
    context: RejectOrderContext,
): DeliveryAppState =
  val nextOrders = current.orders.map(entry =>
    if entry.id == orderId then
      entry.copy(
        fulfillment = entry.fulfillment.copy(status = OrderStatus.Cancelled),
        reviewState = entry.reviewState.copy(merchantRejectReason = Some(context.reason)),
        lifecycle = entry.lifecycle.copy(updatedAt = context.timestamp),
        activity = entry.activity.copy(
          timeline = entry.timeline :+ OrderTimelineEntry(
            OrderStatus.Cancelled,
            renderOrderTimelineMessage(OrderTimelineMessage.MerchantRejected(context.reason)),
            context.timestamp,
          )
        ),
      )
    else entry
  )
  val nextCustomers = current.customers.map(customer =>
    if customer.id == context.order.customerId then refundRejectedOrderCustomer(customer, context.order) else customer
  )
  val nextStores = current.stores.map(store =>
    if store.id == context.order.storeId then restoreRejectedOrderStock(store, context.order) else store
  )
  withDerivedData(
    current.copy(
      customers = nextCustomers,
      stores = nextStores,
      deliveryState = current.deliveryState.copy(orders = nextOrders),
    )
  )

def validateReviewOrderRequest(
    current: DeliveryAppState,
    orderId: OrderId,
    request: ReviewOrderRequest,
): Either[ErrorMessage, ReviewOrderContext] =
  for
    order <- findOrder(current, orderId)
    customer <- findOrderCustomer(current, order.customerId)
    timestamp = now()
    _ <- requireReviewableOrder(order, customer, timestamp)
    sanitized <- validateReviewRequest(request)
    _ <- Either.cond(sanitized.storeReview.isEmpty || order.storeRating.isEmpty, (), ValidationMessages.Order.StoreReviewAlreadySubmitted)
    _ <- Either.cond(sanitized.riderReview.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty), (), ValidationMessages.Order.RiderReviewAlreadySubmitted)
    _ <- Either.cond(sanitized.riderReview.isEmpty || order.riderId.nonEmpty, (), ValidationMessages.Order.RiderReviewUnavailable)
  yield ReviewOrderContext(order = order, customer = customer, timestamp = timestamp, sanitized = sanitized)

def validateStoreReviewReplyRequest(
    current: DeliveryAppState,
    orderId: OrderId,
    request: AppendStoreReviewReplyRequest,
): Either[ErrorMessage, (OrderSummary, NoteText, IsoDateTime)] =
  for
    order <- findOrder(current, orderId)
    _ <- requireOrderStatus(order, OrderStatus.Completed, ValidationMessages.Order.StoreReviewReplyUnavailable)
    _ <- Either.cond(order.reviewStatus == ReviewStatus.Active, (), ValidationMessages.Order.StoreReviewReplyUnavailable)
    _ <- Either.cond(order.storeRating.nonEmpty, (), ValidationMessages.Order.StoreReviewReplyUnavailable)
    _ <- Either.cond(order.storeMerchantReply.isEmpty, (), ValidationMessages.Order.StoreReviewReplyAlreadySubmitted)
    reply <- sanitizeRequiredText(
      request.reply,
      DeliveryValidationDefaults.ReviewExtraNoteMaxLength,
      ValidationMessages.Order.StoreReviewReplyRequired,
    )
    timestamp = now()
  yield (order, reply, timestamp)

def applyReviewedOrderState(
    current: DeliveryAppState,
    orderId: OrderId,
    context: ReviewOrderContext,
): DeliveryAppState =
  val nextOrders = current.orders.map(entry =>
    if entry.id == orderId then applyReviewToOrder(entry, context.sanitized, context.timestamp) else entry
  )
  val nextTickets =
    reviewTicket(context.order, context.sanitized, context.timestamp)
      .map(_ :: current.tickets)
      .getOrElse(current.tickets)
  withDerivedData(
    current.copy(
      deliveryState = current.deliveryState.copy(
        orders = nextOrders,
        tickets = nextTickets,
      )
    )
  )

def applyStoreReviewReplyState(
    current: DeliveryAppState,
    orderId: OrderId,
    reply: NoteText,
    timestamp: IsoDateTime,
): DeliveryAppState =
  withDerivedData(
    current.copy(
      deliveryState = current.deliveryState.copy(
        orders = current.orders.map(entry =>
          if entry.id == orderId then
            entry.copy(
              reviewContent = entry.reviewContent.copy(
                storeMerchantReply = Some(reply),
                storeMerchantReplyAt = Some(timestamp),
              ),
              lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
            )
          else entry
        )
      )
    )
  )
