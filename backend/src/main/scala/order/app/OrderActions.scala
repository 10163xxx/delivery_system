package order.app

import domain.shared.given

import cats.effect.IO
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.rider.*
import domain.shared.*
import shared.app.*

private val merchantAcceptedNote = MerchantAcceptedTimelineNote
private val merchantPreparedNote = MerchantPreparedTimelineNote
private val riderSuspended = RiderSuspendedStatus
private val riderOnDelivery = RiderOnDeliveryStatus
private val riderAvailable = RiderAvailableStatus

private def findOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)

private def findOrderCustomer(
      current: DeliveryAppState,
      customerId: CustomerId,
  ): Either[ErrorMessage, Customer] =
    current.customers.find(_.id == customerId).toRight(ValidationMessages.CustomerNotFound)

private def findOrderStore(
      current: DeliveryAppState,
      storeId: StoreId,
  ): Either[ErrorMessage, Store] =
    current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)

private def requireOrderStatus(
      order: OrderSummary,
      status: OrderStatus,
      error: ErrorMessage,
  ): Either[ErrorMessage, Unit] =
    Either.cond(order.status == status, (), error)

private def findRider(
      current: DeliveryAppState,
      riderId: RiderId,
  ): Either[ErrorMessage, Rider] =
    current.riders.find(_.id == riderId).toRight(ValidationMessages.RiderNotFound)

private def refundRejectedOrderCustomer(customer: Customer, order: OrderSummary): Customer =
    val restoredCoupons =
      order.appliedCoupon match
        case Some(coupon) if !customer.coupons.exists(_.id == coupon.id) => coupon :: customer.coupons
        case _ => customer.coupons
    customer.copy(
      balanceCents = customer.balanceCents + order.totalPriceCents,
      coupons = restoredCoupons,
    )

private def restoreRejectedOrderStock(store: Store, order: OrderSummary): Store =
    store.copy(
      menu = store.menu.map(menuItem =>
        order.items.find(_.menuItemId == menuItem.id) match
          case Some(lineItem) =>
            menuItem.copy(remainingQuantity = menuItem.remainingQuantity.map(quantity => quantity + lineItem.quantity))
          case None => menuItem
      )
    )

private def lineItemSubtotalCents(items: List[OrderLineItem]): CurrencyCents =
    items.map(item => item.unitPriceCents * item.quantity).sum

private final case class OrderPriceBreakdown(
    itemSubtotalCents: CurrencyCents,
    couponDiscountCents: CurrencyCents,
    totalPriceCents: CurrencyCents,
)

private def calculateOrderPriceBreakdown(
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

private def reserveOrderStock(store: Store, items: List[OrderLineItem]): Store =
    store.copy(
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

private def chargeOrderCustomer(
      customer: Customer,
      totalPriceCents: CurrencyCents,
      appliedCoupon: Option[Coupon],
  ): Customer =
    customer.copy(
      balanceCents = customer.balanceCents - totalPriceCents,
      coupons = appliedCoupon match
        case Some(coupon) => customer.coupons.filterNot(_.id == coupon.id)
        case None => customer.coupons,
    )

private def createPendingOrder(
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

private def assignOrderRider(
      order: OrderSummary,
      rider: Rider,
      timestamp: IsoDateTime,
  ): OrderSummary =
    order.copy(
      riderId = Some(rider.id),
      riderName = Some(rider.name),
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.ReadyForPickup,
        renderOrderTimelineMessage(OrderTimelineMessage.RiderAssigned(rider.name)),
        timestamp,
      ),
    )

private def markOrderPickedUp(order: OrderSummary, timestamp: IsoDateTime): OrderSummary =
    order.copy(
      status = OrderStatus.Delivering,
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(OrderStatus.Delivering, RiderPickedUpTimelineNote, timestamp),
    )

private def markOrderDelivered(order: OrderSummary, timestamp: IsoDateTime): OrderSummary =
    order.copy(
      status = OrderStatus.Completed,
      updatedAt = timestamp,
      timeline = order.timeline :+ OrderTimelineEntry(OrderStatus.Completed, RiderDeliveredTimelineNote, timestamp),
    )

private def requireReviewableOrder(
      order: OrderSummary,
      customer: Customer,
      timestamp: IsoDateTime,
  ): Either[ErrorMessage, Unit] =
    for
      _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), ValidationMessages.CustomerAccountSuspended)
      _ <- requireOrderStatus(order, OrderStatus.Completed, ValidationMessages.OnlyCompletedOrdersCanReview)
      _ <- Either.cond(canReviewOrder(order, timestamp), (), reviewWindowExpired(ReviewWindowDays))
    yield ()

def createOrder(request: CreateOrderRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- findOrderCustomer(current, request.customerId)
          _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), ValidationMessages.CustomerAccountSuspended)
          store <- findOrderStore(current, request.storeId)
          _ <- Either.cond(store.status != StoreRevokedStatus, (), ValidationMessages.StoreRevoked)
          timestamp = now()
          _ <- Either.cond(isStoreOpenAt(store, timestamp), (), storeCurrentlyClosed(formatBusinessHours(store.businessHours)))
          items <- buildLineItems(store, request.items)
          deliveryAddress <- sanitizeRequiredText(request.deliveryAddress, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.DeliveryAddressRequired)
          scheduledDeliveryAt <- validateScheduledDeliveryAt(request.scheduledDeliveryAt, timestamp)
          itemSubtotalCents = lineItemSubtotalCents(items)
          appliedCoupon <- validateOrderCoupon(customer, request.couponId, itemSubtotalCents)
          priceBreakdown = calculateOrderPriceBreakdown(itemSubtotalCents, appliedCoupon)
          _ <- Either.cond(customer.balanceCents >= priceBreakdown.totalPriceCents, (), ValidationMessages.InsufficientBalanceForOrder)
        yield
          val order = createPendingOrder(
            customer = customer,
            store = store,
            deliveryAddress = deliveryAddress,
            scheduledDeliveryAt = scheduledDeliveryAt,
            remark = sanitizeOptionalText(request.remark, DeliveryValidationDefaults.OrderRemarkMaxLength),
            items = items,
            appliedCoupon = appliedCoupon,
            priceBreakdown = priceBreakdown,
            timestamp = timestamp,
          )
          withDerivedData(
            current.copy(
              orders = order :: current.orders,
              stores = current.stores.map(entry =>
                if entry.id == store.id then reserveOrderStock(entry, items)
                else entry
              ),
              customers = current.customers.map(entry =>
                if entry.id == customer.id then chargeOrderCustomer(entry, priceBreakdown.totalPriceCents, appliedCoupon)
                else entry
              ),
            )
          )
      }
    }

def acceptOrder(orderId: OrderId): IO[Either[ErrorMessage, DeliveryAppState]] =
    transitionOrder(orderId, OrderStatus.PendingMerchantAcceptance, OrderStatus.Preparing, merchantAcceptedNote)

def rejectOrder(orderId: OrderId, request: RejectOrderRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findOrder(current, orderId)
          _ <- requireOrderStatus(order, OrderStatus.PendingMerchantAcceptance, ValidationMessages.OrderCannotReject)
          reason <- sanitizeRequiredText(request.reason, DeliveryValidationDefaults.OrderReasonMaxLength, ValidationMessages.RejectOrderReasonRequired)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                status = OrderStatus.Cancelled,
                merchantRejectReason = Some(reason),
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(
                  OrderStatus.Cancelled,
                  renderOrderTimelineMessage(OrderTimelineMessage.MerchantRejected(reason)),
                  timestamp,
                ),
              )
            else entry
          )
          val nextCustomers = current.customers.map(customer =>
            if customer.id == order.customerId then refundRejectedOrderCustomer(customer, order)
            else customer
          )
          val nextStores = current.stores.map(store =>
            if store.id == order.storeId then restoreRejectedOrderStock(store, order)
            else store
          )
          withDerivedData(current.copy(orders = nextOrders, customers = nextCustomers, stores = nextStores))
      }
    }

def readyOrder(orderId: OrderId): IO[Either[ErrorMessage, DeliveryAppState]] =
    transitionOrder(orderId, OrderStatus.Preparing, OrderStatus.ReadyForPickup, merchantPreparedNote)

def assignRider(orderId: OrderId, request: AssignRiderRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findOrder(current, orderId)
          _ <- requireOrderStatus(order, OrderStatus.ReadyForPickup, ValidationMessages.OrderCannotAssignRider)
          _ <- Either.cond(order.riderId.isEmpty, (), ValidationMessages.OrderAlreadyAssignedRider)
          rider <- findRider(current, request.riderId)
          _ <- Either.cond(rider.availability != riderSuspended, (), ValidationMessages.RiderSuspended)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then assignOrderRider(entry, rider, timestamp)
            else entry
          )
          val nextRiders = current.riders.map(entry =>
            if entry.id == rider.id then entry.copy(availability = riderOnDelivery) else entry
          )
          withDerivedData(current.copy(orders = nextOrders, riders = nextRiders))
      }
    }

def pickupOrder(orderId: OrderId): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findOrder(current, orderId)
          _ <- requireOrderStatus(order, OrderStatus.ReadyForPickup, ValidationMessages.OrderCannotPickup)
          _ <- Either.cond(order.riderId.nonEmpty, (), ValidationMessages.RiderAssignmentRequired)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then markOrderPickedUp(entry, timestamp)
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

def deliverOrder(orderId: OrderId): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findOrder(current, orderId)
          _ <- requireOrderStatus(order, OrderStatus.Delivering, ValidationMessages.OrderCannotDeliver)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then markOrderDelivered(entry, timestamp)
            else entry
          )
          val nextRiders = current.riders.map(rider =>
            if Some(rider.id) == order.riderId then rider.copy(availability = riderAvailable) else rider
          )
          withDerivedData(current.copy(orders = nextOrders, riders = nextRiders))
      }
    }

def reviewOrder(orderId: OrderId, request: ReviewOrderRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findOrder(current, orderId)
          customer <- findOrderCustomer(current, order.customerId)
          timestamp = now()
          _ <- requireReviewableOrder(order, customer, timestamp)
          sanitized <- validateReviewRequest(request)
          _ <- Either.cond(sanitized.storeReview.isEmpty || order.storeRating.isEmpty, (), ValidationMessages.StoreReviewAlreadySubmitted)
          _ <- Either.cond(sanitized.riderReview.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty), (), ValidationMessages.RiderReviewAlreadySubmitted)
          _ <- Either.cond(sanitized.riderReview.isEmpty || order.riderId.nonEmpty, (), ValidationMessages.RiderReviewUnavailable)
        yield
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then applyReviewToOrder(entry, sanitized, timestamp) else entry
          )
          val nextTickets = reviewTicket(order, sanitized, timestamp).map(_ :: current.tickets).getOrElse(current.tickets)
          withDerivedData(current.copy(orders = nextOrders, tickets = nextTickets))
      }
    }
