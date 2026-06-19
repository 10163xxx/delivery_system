package services.order.utils

// Business note: fulfillment and review transition helpers for existing orders.
import system.objects.given
import system.app.objects.*

import services.customer.objects.*
import services.merchant.objects.*
import services.order.objects.*
import services.review.objects.*
import services.rider.objects.*
import system.objects.*
import system.app.*

val merchantAcceptedNote = MerchantAcceptedTimelineNote
val merchantPreparedNote = MerchantPreparedTimelineNote
val riderSuspended = RiderSuspendedStatus
val riderOnDelivery = RiderOnDeliveryStatus
val riderAvailable = RiderAvailableStatus

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
