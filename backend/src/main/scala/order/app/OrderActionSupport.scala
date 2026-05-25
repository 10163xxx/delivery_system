package order.app

import domain.shared.given

import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.rider.*
import domain.shared.*
import shared.app.*

val merchantAcceptedNote = MerchantAcceptedTimelineNote
val merchantPreparedNote = MerchantPreparedTimelineNote
val riderSuspended = RiderSuspendedStatus
val riderOnDelivery = RiderOnDeliveryStatus
val riderAvailable = RiderAvailableStatus

def findOrder(
    current: DeliveryAppState,
    orderId: OrderId,
): Either[ErrorMessage, OrderSummary] =
  current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)

def findOrderCustomer(
    current: DeliveryAppState,
    customerId: CustomerId,
): Either[ErrorMessage, Customer] =
  current.customers.find(_.id == customerId).toRight(ValidationMessages.Customer.CustomerNotFound)

def findOrderStore(
    current: DeliveryAppState,
    storeId: StoreId,
): Either[ErrorMessage, Store] =
  current.stores.find(_.id == storeId).toRight(ValidationMessages.Merchant.StoreNotFound)

def requireOrderStatus(
    order: OrderSummary,
    status: OrderStatus,
    error: ErrorMessage,
): Either[ErrorMessage, Unit] =
  Either.cond(order.status == status, (), error)

def findRider(
    current: DeliveryAppState,
    riderId: RiderId,
): Either[ErrorMessage, Rider] =
  current.riders.find(_.id == riderId).toRight(ValidationMessages.Merchant.RiderNotFound)

def refundRejectedOrderCustomer(customer: Customer, order: OrderSummary): Customer =
  val restoredCoupons =
    order.appliedCoupon match
      case Some(coupon) if !customer.coupons.exists(_.id == coupon.id) => coupon :: customer.coupons
      case _ => customer.coupons
  customer.copy(
    metrics = customer.metrics.copy(
      balanceCents = customer.balanceCents + order.totalPriceCents,
      coupons = restoredCoupons,
    ),
  )

def restoreRejectedOrderStock(store: Store, order: OrderSummary): Store =
  store.copy(
    operations = store.operations.copy(
      menu = store.menu.map(menuItem =>
        order.items.find(_.menuItemId == menuItem.id) match
          case Some(lineItem) =>
            menuItem.copy(remainingQuantity = menuItem.remainingQuantity.map(quantity => quantity + lineItem.quantity))
          case None => menuItem
      )
    )
  )

def lineItemSubtotalCents(items: List[OrderLineItem]): CurrencyCents =
  items.map(item => item.unitPriceCents * item.quantity).sum

def calculateOrderPriceBreakdown(
    itemSubtotalCents: CurrencyCents,
    appliedCoupon: Option[Coupon],
): OrderPriceBreakdown =
  val couponDiscountCents = calculateCouponDiscount(appliedCoupon, itemSubtotalCents, DeliveryFeeCents)
  val totalPriceCents =
    Math.max(NumericDefaults.ZeroCurrencyCents, itemSubtotalCents + DeliveryFeeCents - couponDiscountCents)
  OrderPriceBreakdown(
    itemSubtotalCents = itemSubtotalCents,
    couponDiscountCents = couponDiscountCents,
    totalPriceCents = totalPriceCents,
  )

def reserveOrderStock(store: Store, items: List[OrderLineItem]): Store =
  store.copy(
    operations = store.operations.copy(
      menu = store.menu.map { menuItem =>
        items.find(_.menuItemId == menuItem.id) match
          case Some(lineItem) =>
            menuItem.copy(
              remainingQuantity = menuItem.remainingQuantity.map(quantity =>
                Math.max(NumericDefaults.ZeroQuantity, quantity - lineItem.quantity)
              )
            )
          case None => menuItem
      }
    )
  )

def chargeOrderCustomer(
    customer: Customer,
    totalPriceCents: CurrencyCents,
    appliedCoupon: Option[Coupon],
): Customer =
  customer.copy(
    metrics = customer.metrics.copy(
      balanceCents = customer.balanceCents - totalPriceCents,
      coupons = appliedCoupon match
        case Some(coupon) => customer.coupons.filterNot(_.id == coupon.id)
        case None => customer.coupons,
    ),
  )

def createPendingOrder(
    customer: Customer,
    store: Store,
    deliveryAddress: AddressText,
    scheduledDeliveryAt: IsoDateTime,
    remark: Option[NoteText],
    items: List[OrderLineItem],
    appliedCoupon: Option[Coupon],
    priceBreakdown: OrderPriceBreakdown,
    timestamp: IsoDateTime,
): OrderSummary =
  OrderSummary(
    id = nextId(OrderIdPrefix),
    customerId = customer.id,
    customerName = customer.name,
    storeId = store.id,
    storeName = store.name,
    riderId = None,
    riderName = None,
    status = OrderStatus.PendingMerchantAcceptance,
    deliveryAddress = deliveryAddress,
    scheduledDeliveryAt = scheduledDeliveryAt,
    remark = remark,
    items = items,
    itemSubtotalCents = priceBreakdown.itemSubtotalCents,
    deliveryFeeCents = DeliveryFeeCents,
    couponDiscountCents = priceBreakdown.couponDiscountCents,
    appliedCoupon = appliedCoupon,
    totalPriceCents = priceBreakdown.totalPriceCents,
    createdAt = timestamp,
    updatedAt = timestamp,
    storeRating = None,
    riderRating = None,
    reviewComment = None,
    reviewExtraNote = None,
    storeReviewComment = None,
    storeReviewExtraNote = None,
    storeMerchantReply = None,
    storeMerchantReplyAt = None,
    riderReviewComment = None,
    riderReviewExtraNote = None,
    merchantRejectReason = None,
    reviewStatus = ReviewStatus.Active,
    reviewRevokedReason = None,
    reviewRevokedAt = None,
    timeline = List(
      OrderTimelineEntry(
        OrderStatus.PendingMerchantAcceptance,
        renderOrderTimelineMessage(
          OrderTimelineMessage.OrderPlaced(
            scheduledDeliveryAt,
            appliedCoupon.map(_.title),
            priceBreakdown.couponDiscountCents,
          )
        ),
        timestamp,
      )
    ),
    chatMessages = List.empty,
    partialRefundRequests = List.empty,
  )

def assignOrderRider(
    order: OrderSummary,
    rider: Rider,
    timestamp: IsoDateTime,
): OrderSummary =
  order.copy(
    identity = order.identity.copy(
      riderId = Some(rider.id),
      riderName = Some(rider.name),
    ),
    lifecycle = order.lifecycle.copy(updatedAt = timestamp),
    activity = order.activity.copy(
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.ReadyForPickup,
        renderOrderTimelineMessage(OrderTimelineMessage.RiderAssigned(rider.name)),
        timestamp,
      )
    ),
  )

def markOrderPickedUp(order: OrderSummary, timestamp: IsoDateTime): OrderSummary =
  order.copy(
    fulfillment = order.fulfillment.copy(status = OrderStatus.Delivering),
    lifecycle = order.lifecycle.copy(updatedAt = timestamp),
    activity = order.activity.copy(
      timeline = order.timeline :+ OrderTimelineEntry(OrderStatus.Delivering, RiderPickedUpTimelineNote, timestamp)
    ),
  )

def markOrderDelivered(order: OrderSummary, timestamp: IsoDateTime): OrderSummary =
  order.copy(
    fulfillment = order.fulfillment.copy(status = OrderStatus.Completed),
    lifecycle = order.lifecycle.copy(updatedAt = timestamp),
    activity = order.activity.copy(
      timeline = order.timeline :+ OrderTimelineEntry(OrderStatus.Completed, RiderDeliveredTimelineNote, timestamp)
    ),
  )

def requireReviewableOrder(
    order: OrderSummary,
    customer: Customer,
    timestamp: IsoDateTime,
): Either[ErrorMessage, Unit] =
  for
    _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), ValidationMessages.Customer.CustomerAccountSuspended)
    _ <- requireOrderStatus(order, OrderStatus.Completed, ValidationMessages.Order.OnlyCompletedOrdersCanReview)
    _ <- Either.cond(canReviewOrder(order, timestamp), (), reviewWindowExpired(ReviewWindowDays))
  yield ()
