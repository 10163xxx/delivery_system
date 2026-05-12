package shared.app

import domain.shared.given

import domain.order.*
import domain.rider.*
import domain.shared.*

import java.time.Instant

val riderAvailable = RiderAvailableStatus
val riderOnDelivery = RiderOnDeliveryStatus
val riderSuspended = RiderSuspendedStatus
val storeRevoked = StoreRevokedStatus
val storeBusy = StoreBusyStatus
val storeOpen = StoreOpenStatus

def merchantIncomeForOrder(order: OrderSummary): CurrencyCents =
  order.itemSubtotalCents * MerchantRevenueShareNumerator / MerchantRevenueShareDenominator

def riderIncomeForOrders(
    orders: List[OrderSummary],
    riderId: RiderId,
): CurrencyCents =
  orders.count(order =>
    order.status == OrderStatus.Completed && order.riderId.contains(riderId)
  ) * RiderEarningPerOrderCents

def applyAutomaticDispatch(
    state: DeliveryAppState,
    currentTime: IsoDateTime,
): DeliveryAppState =
  val membershipByCustomer = state.orders
    .filter(order =>
      order.status == OrderStatus.Completed &&
        isWithinRecentWindow(order.updatedAt, currentTime, MonthlyWindowDays),
    )
    .groupBy(_.customerId)
    .view
    .mapValues(orders => orders.map(_.totalPriceCents).sum)
    .toMap
  val candidateOrders = state.orders
    .filter(order =>
      order.status == OrderStatus.ReadyForPickup &&
        order.riderId.isEmpty &&
        minutesBetween(order.updatedAt, currentTime) >= autoDispatchMinutesForCustomer(
          membershipByCustomer.getOrElse(
            order.customerId,
            NumericDefaults.ZeroCurrencyCents,
          ),
        ),
    )
    .sortBy(_.updatedAt)
  val initial = (state.orders, state.riders)
  val (nextOrders, nextRiders) =
    candidateOrders.foldLeft(initial) { case ((orders, riders), targetOrder) =>
      val availableRider = riders.find(_.availability == riderAvailable)
      availableRider match
        case Some(rider) =>
          val note =
            if autoDispatchMinutesForCustomer(
                membershipByCustomer.getOrElse(
                  targetOrder.customerId,
                  NumericDefaults.ZeroCurrencyCents,
                ),
              ) == MemberAutoDispatchMinutes
            then
              new DisplayText(List("系统已为会员订单优先指派骑手 ", rider.name.raw).mkString)
            else new DisplayText(List("系统已为超时订单指派骑手 ", rider.name.raw).mkString)
          val updatedOrders = orders.map(order =>
            if order.id == targetOrder.id then
              order.copy(
                identity = order.identity.copy(
                  riderId = Some(rider.id),
                  riderName = Some(rider.name),
                ),
                lifecycle = order.lifecycle.copy(updatedAt = currentTime),
                activity = order.activity.copy(
                  timeline =
                    order.timeline :+ OrderTimelineEntry(
                      OrderStatus.ReadyForPickup,
                      note,
                      currentTime,
                    ),
                ),
              )
            else order
          )
          val updatedRiders = riders.map(entry =>
            if entry.id == rider.id then entry.copy(availability = riderOnDelivery)
            else entry
          )
          (updatedOrders, updatedRiders)
        case None => (orders, riders)
    }
  state.copy(
    riders = nextRiders,
    deliveryState = state.deliveryState.copy(orders = nextOrders),
  )

def autoDispatchMinutesForCustomer(
    monthlySpendCents: CurrencyCents
): DurationDays =
  if monthlySpendCents > MemberMonthlySpendThresholdCents then
    MemberAutoDispatchMinutes
  else StandardAutoDispatchMinutes

def minutesBetween(from: IsoDateTime, to: IsoDateTime): DurationDays =
  java.time.Duration.between(Instant.parse(from.raw), Instant.parse(to.raw)).toMinutes
