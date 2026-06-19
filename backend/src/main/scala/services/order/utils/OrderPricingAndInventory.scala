package services.order.utils

// Business note: order pricing, coupon, balance, and inventory calculations used during order creation and rejection.
import system.objects.given
import system.app.objects.*

import services.customer.objects.*
import services.merchant.objects.*
import services.order.objects.*
import services.review.objects.*
import system.objects.*
import system.app.*

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
    deliveryFeeCents: CurrencyCents,
): OrderPriceBreakdown =
  val couponDiscountCents = calculateCouponDiscount(appliedCoupon, itemSubtotalCents, deliveryFeeCents)
  val totalPriceCents =
    maxCurrencyCents(NumericDefaults.ZeroCurrencyCents, itemSubtotalCents + deliveryFeeCents - couponDiscountCents)
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
                maxQuantity(NumericDefaults.ZeroQuantity, quantity - lineItem.quantity)
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
    deliveryFeeCents: CurrencyCents,
    scheduledDeliveryAt: IsoDateTime,
    remark: Option[NoteText],
    items: List[OrderLineItem],
    appliedCoupon: Option[Coupon],
    priceBreakdown: OrderPriceBreakdown,
    timestamp: IsoDateTime,
): OrderSummary =
  OrderSummary(
    identity = OrderSummaryIdentity(
      id = nextId(OrderIdPrefix),
      customerId = customer.id,
      customerName = customer.name,
      storeId = store.id,
      storeName = store.name,
      riderId = None,
      riderName = None,
    ),
    fulfillment = OrderSummaryFulfillment(
      status = OrderStatus.PendingMerchantAcceptance,
      deliveryAddress = deliveryAddress,
      scheduledDeliveryAt = scheduledDeliveryAt,
      remark = remark,
      items = items,
    ),
    pricing = OrderSummaryPricing(
      itemSubtotalCents = priceBreakdown.itemSubtotalCents,
      deliveryFeeCents = deliveryFeeCents,
      couponDiscountCents = priceBreakdown.couponDiscountCents,
      appliedCoupon = appliedCoupon,
      totalPriceCents = priceBreakdown.totalPriceCents,
    ),
    lifecycle = OrderSummaryLifecycle(createdAt = timestamp, updatedAt = timestamp),
    reviewState = OrderSummaryReviewState(
      storeRating = None,
      riderRating = None,
      merchantRejectReason = None,
      reviewStatus = ReviewStatus.Active,
      reviewRevokedReason = None,
      reviewRevokedAt = None,
    ),
    reviewContent = OrderSummaryReviewContent(
      reviewComment = None,
      reviewExtraNote = None,
      storeReviewComment = None,
      storeReviewExtraNote = None,
      storeMerchantReply = None,
      storeMerchantReplyAt = None,
      riderReviewComment = None,
      riderReviewExtraNote = None,
    ),
    activity = OrderSummaryActivity(
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
    ),
  )
