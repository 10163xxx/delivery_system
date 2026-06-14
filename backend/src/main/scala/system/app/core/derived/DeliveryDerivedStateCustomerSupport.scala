package system.app

import domain.shared.given

import domain.customer.*
import domain.order.*
import domain.review.*
import domain.shared.*

private[app] final case class CustomerDerivedCollections(
    completedOrdersByCustomer: Map[CustomerId, List[OrderSummary]],
    refundedCouponsByCustomer: Map[CustomerId, List[Coupon]],
    monthlySpendByCustomer: Map[CustomerId, CurrencyCents],
    revokedCountsByCustomer: Map[CustomerId, EntityCount],
)

private[app] def collectCustomerDerivedCollections(
    state: DeliveryAppState,
    revokedReviewedOrders: List[OrderSummary],
    currentTime: IsoDateTime,
): CustomerDerivedCollections =
  CustomerDerivedCollections(
    completedOrdersByCustomer = state.orders
      .filter(_.status == OrderStatus.Completed)
      .groupBy(_.customerId)
      .view
      .mapValues(_.sortBy(order => reviewEligibilityTimestamp(order)))
      .toMap,
    refundedCouponsByCustomer = state.orders
      .filter(order =>
        order.status == OrderStatus.Cancelled &&
          order.merchantRejectReason.nonEmpty &&
          order.appliedCoupon.nonEmpty,
      )
      .groupBy(_.customerId)
      .view
      .mapValues(orders => orders.flatMap(_.appliedCoupon))
      .toMap,
    monthlySpendByCustomer = state.orders
      .filter(order =>
        order.status == OrderStatus.Completed &&
          isWithinRecentWindow(order.updatedAt, currentTime, MonthlyWindowDays),
      )
      .groupBy(_.customerId)
      .view
      .mapValues(orders => orders.map(_.totalPriceCents).sum)
      .toMap,
    revokedCountsByCustomer = revokedReviewedOrders
      .groupBy(_.customerId)
      .view
      .mapValues(orders => new EntityCount(orders.size))
      .toMap,
  )

private[app] def deriveCustomers(
    customers: List[Customer],
    collections: CustomerDerivedCollections,
    currentTime: IsoDateTime,
): List[Customer] =
  customers.map(customer =>
    val alias = customerAlias(customer.id)
    val monthlySpendCents =
      collections.monthlySpendByCustomer.getOrElse(
        customer.id,
        NumericDefaults.ZeroCurrencyCents,
      )
    val membershipTier =
      if monthlySpendCents > MemberMonthlySpendThresholdCents then
        MembershipTier.Member
      else MembershipTier.Standard
    customer.copy(
      name = alias,
      accountStatus =
        if collections.revokedCountsByCustomer.getOrElse(
            customer.id,
            NumericDefaults.ZeroCount,
          ) > CustomerBanThreshold
        then AccountStatus.Suspended
        else AccountStatus.Active,
      metrics = customer.metrics.copy(
        revokedReviewCount = collections.revokedCountsByCustomer.getOrElse(
          customer.id,
          NumericDefaults.ZeroCount,
        ),
        membershipTier = membershipTier,
        monthlySpendCents = monthlySpendCents,
        coupons = couponsForCustomer(
          customer.id,
          membershipTier,
          customer.coupons,
          collections.refundedCouponsByCustomer.getOrElse(customer.id, List.empty),
          collections.completedOrdersByCustomer.getOrElse(customer.id, List.empty),
          currentTime,
        ),
      ),
    )
  )

private[app] def deriveOrdersWithCustomerAliases(
    orders: List[OrderSummary]
): List[OrderSummary] =
  orders.map(order =>
    order.copy(
      identity = order.identity.copy(customerName = customerAlias(order.customerId)),
      activity = order.activity.copy(
        chatMessages = order.chatMessages.map(message =>
          if message.senderRole == UserRole.customer then
            message.copy(senderName = customerAlias(order.customerId))
          else message
        ),
      ),
    )
  )

private[app] def deriveAppealsWithCustomerAliases(
    appeals: List[ReviewAppeal]
): List[ReviewAppeal] =
  appeals.map(appeal =>
    appeal.copy(identity = appeal.identity.copy(customerName = customerAlias(appeal.customerId)))
  )
