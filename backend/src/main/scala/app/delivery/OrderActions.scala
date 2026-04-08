package app.delivery

import cats.effect.IO
import domain.customer.*
import domain.order.*
import domain.review.*
import domain.shared.*

def createOrder(request: CreateOrderRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          customer <- current.customers.find(_.id == request.customerId).toRight(ValidationMessages.CustomerNotFound)
          _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), ValidationMessages.CustomerAccountSuspended)
          store <- current.stores.find(_.id == request.storeId).toRight(ValidationMessages.StoreNotFound)
          _ <- Either.cond(store.status != "Revoked", (), ValidationMessages.StoreRevoked)
          timestamp = now()
          _ <- Either.cond(isStoreOpenAt(store, timestamp), (), ValidationMessages.storeCurrentlyClosed(formatBusinessHours(store.businessHours)))
          items <- buildLineItems(store, request.items)
          deliveryAddress <- sanitizeRequiredText(request.deliveryAddress, DeliveryValidationDefaults.AddressMaxLength, ValidationMessages.DeliveryAddressRequired)
          scheduledDeliveryAt <- validateScheduledDeliveryAt(request.scheduledDeliveryAt, timestamp)
          itemSubtotalCents = items.map(item => item.unitPriceCents * item.quantity).sum
          appliedCoupon <- validateOrderCoupon(customer, request.couponId, itemSubtotalCents)
          couponDiscountCents = calculateCouponDiscount(appliedCoupon, itemSubtotalCents, DeliveryFeeCents)
          totalPriceCents = Math.max(0, itemSubtotalCents + DeliveryFeeCents - couponDiscountCents)
          _ <- Either.cond(customer.balanceCents >= totalPriceCents, (), ValidationMessages.InsufficientBalanceForOrder)
        yield
          val order = OrderSummary(
            id = nextId("ord"),
            customerId = customer.id,
            customerName = customer.name,
            storeId = store.id,
            storeName = store.name,
            riderId = None,
            riderName = None,
            status = OrderStatus.PendingMerchantAcceptance,
            deliveryAddress = deliveryAddress,
            scheduledDeliveryAt = scheduledDeliveryAt,
            remark = sanitizeOptionalText(request.remark, DeliveryValidationDefaults.OrderRemarkMaxLength),
            items = items,
            itemSubtotalCents = itemSubtotalCents,
            deliveryFeeCents = DeliveryFeeCents,
            couponDiscountCents = couponDiscountCents,
            appliedCoupon = appliedCoupon,
            totalPriceCents = totalPriceCents,
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
                appliedCoupon match
                  case Some(coupon) =>
                    f"顾客已下单并完成余额支付，使用 ${coupon.title} 抵扣 ${couponDiscountCents / 100.0}%.2f 元，预约送达时间 ${scheduledDeliveryAt}"
                  case None =>
                    s"顾客已下单并完成余额支付，预约送达时间 ${scheduledDeliveryAt}",
                timestamp,
              )
            ),
            chatMessages = List.empty,
            partialRefundRequests = List.empty,
          )
          withDerivedData(
            current.copy(
              orders = order :: current.orders,
              stores = current.stores.map(entry =>
                if entry.id == store.id then
                  entry.copy(
                    menu = entry.menu.map { menuItem =>
                      items.find(_.menuItemId == menuItem.id) match
                        case Some(lineItem) =>
                          menuItem.copy(
                            remainingQuantity = menuItem.remainingQuantity.map(quantity =>
                              Math.max(0, quantity - lineItem.quantity)
                            )
                          )
                        case None => menuItem
                    }
                  )
                else entry
              ),
              customers = current.customers.map(entry =>
                if entry.id == customer.id then
                  entry.copy(
                    balanceCents = entry.balanceCents - totalPriceCents,
                    coupons = appliedCoupon match
                      case Some(coupon) => entry.coupons.filterNot(_.id == coupon.id)
                      case None => entry.coupons,
                  )
                else entry
              ),
            )
          )
      }
    }

def acceptOrder(orderId: String): IO[Either[String, DeliveryAppState]] =
    transitionOrder(orderId, OrderStatus.PendingMerchantAcceptance, OrderStatus.Preparing, "商家已接单，开始备餐")

def rejectOrder(orderId: String, request: RejectOrderRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(order.status == OrderStatus.PendingMerchantAcceptance, (), ValidationMessages.OrderCannotReject)
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
                  s"商家已拒单，理由：$reason。订单金额已原路退回",
                  timestamp,
                ),
              )
            else entry
          )
          val nextCustomers = current.customers.map(customer =>
            if customer.id == order.customerId then customer.copy(balanceCents = customer.balanceCents + order.totalPriceCents)
            else customer
          )
          val nextStores = current.stores.map(store =>
            if store.id == order.storeId then
              store.copy(
                menu = store.menu.map(menuItem =>
                  order.items.find(_.menuItemId == menuItem.id) match
                    case Some(lineItem) =>
                      menuItem.copy(remainingQuantity = menuItem.remainingQuantity.map(quantity => quantity + lineItem.quantity))
                    case None => menuItem
                )
              )
            else store
          )
          withDerivedData(current.copy(orders = nextOrders, customers = nextCustomers, stores = nextStores))
      }
    }

def readyOrder(orderId: String): IO[Either[String, DeliveryAppState]] =
    transitionOrder(orderId, OrderStatus.Preparing, OrderStatus.ReadyForPickup, "商家已完成备餐，等待骑手取餐")

def assignRider(orderId: String, request: AssignRiderRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(order.status == OrderStatus.ReadyForPickup, (), ValidationMessages.OrderCannotAssignRider)
          _ <- Either.cond(order.riderId.isEmpty, (), ValidationMessages.OrderAlreadyAssignedRider)
          rider <- current.riders.find(_.id == request.riderId).toRight(ValidationMessages.RiderNotFound)
          _ <- Either.cond(rider.availability != "Suspended", (), ValidationMessages.RiderSuspended)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                riderId = Some(rider.id),
                riderName = Some(rider.name),
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(OrderStatus.ReadyForPickup, s"已指派骑手 ${rider.name}", timestamp),
              )
            else entry
          )
          val nextRiders = current.riders.map(entry =>
            if entry.id == rider.id then entry.copy(availability = "OnDelivery") else entry
          )
          withDerivedData(current.copy(orders = nextOrders, riders = nextRiders))
      }
    }

def pickupOrder(orderId: String): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(order.status == OrderStatus.ReadyForPickup, (), ValidationMessages.OrderCannotPickup)
          _ <- Either.cond(order.riderId.nonEmpty, (), ValidationMessages.RiderAssignmentRequired)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                status = OrderStatus.Delivering,
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(OrderStatus.Delivering, "骑手已取餐，订单配送中", timestamp),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

def deliverOrder(orderId: String): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(order.status == OrderStatus.Delivering, (), ValidationMessages.OrderCannotDeliver)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                status = OrderStatus.Completed,
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(OrderStatus.Completed, "骑手已确认送达", timestamp),
              )
            else entry
          )
          val nextRiders = current.riders.map(rider =>
            if Some(rider.id) == order.riderId then rider.copy(availability = "Available") else rider
          )
          withDerivedData(current.copy(orders = nextOrders, riders = nextRiders))
      }
    }

def reviewOrder(orderId: String, request: ReviewOrderRequest): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          customer <- current.customers.find(_.id == order.customerId).toRight(ValidationMessages.CustomerNotFound)
          _ <- Either.cond(customer.accountStatus == AccountStatus.Active, (), ValidationMessages.CustomerAccountSuspended)
          _ <- Either.cond(order.status == OrderStatus.Completed, (), ValidationMessages.OnlyCompletedOrdersCanReview)
          _ <- Either.cond(canReviewOrder(order, now()), (), ValidationMessages.reviewWindowExpired(ReviewWindowDays))
          sanitized <- validateReviewRequest(request)
          _ <- Either.cond(sanitized.storeReview.isEmpty || order.storeRating.isEmpty, (), ValidationMessages.StoreReviewAlreadySubmitted)
          _ <- Either.cond(sanitized.riderReview.isEmpty || (order.riderId.nonEmpty && order.riderRating.isEmpty), (), ValidationMessages.RiderReviewAlreadySubmitted)
          _ <- Either.cond(sanitized.riderReview.isEmpty || order.riderId.nonEmpty, (), ValidationMessages.RiderReviewUnavailable)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then applyReviewToOrder(entry, sanitized, timestamp) else entry
          )
          val nextTickets = reviewTicket(order, sanitized, timestamp).map(_ :: current.tickets).getOrElse(current.tickets)
          withDerivedData(current.copy(orders = nextOrders, tickets = nextTickets))
      }
    }
