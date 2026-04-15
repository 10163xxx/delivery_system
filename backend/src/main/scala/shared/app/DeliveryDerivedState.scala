package shared.app

import domain.shared.given

import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.rider.*
import domain.shared.*

import java.time.Instant

private val riderAvailable = RiderAvailableStatus
private val riderOnDelivery = RiderOnDeliveryStatus
private val riderSuspended = RiderSuspendedStatus
private val storeRevoked = StoreRevokedStatus
private val storeBusy = StoreBusyStatus
private val storeOpen = StoreOpenStatus

def refreshState(state: DeliveryAppState, currentTime: IsoDateTime): DeliveryAppState =
    withDerivedData(applyAutomaticDispatch(state, currentTime), currentTime)

def withDerivedData(state: DeliveryAppState): DeliveryAppState =
    withDerivedData(state, now())

def withDerivedData(state: DeliveryAppState, currentTime: IsoDateTime): DeliveryAppState =
    val activeReviewedOrders = state.orders.filter(order =>
      order.reviewStatus == ReviewStatus.Active &&
      order.storeRating.nonEmpty &&
      order.riderRating.nonEmpty,
    )
    val revokedReviewedOrders = state.orders.filter(order =>
      order.reviewStatus == ReviewStatus.Revoked &&
      (order.storeRating.nonEmpty || order.riderRating.nonEmpty),
    )
    val storeRatings = activeReviewedOrders.flatMap(order =>
      order.storeRating.map(rating => order.storeId -> rating)
    )
    val riderRatings = activeReviewedOrders.flatMap(order =>
      for
        riderId <- order.riderId
        rating <- order.riderRating
      yield riderId -> rating
    )
    val latestStoreReviewReset = latestApprovedEligibilityReviewTimes(
      state.eligibilityReviews,
      EligibilityReviewTarget.Store,
    )
    val latestRiderReviewReset = latestApprovedEligibilityReviewTimes(
      state.eligibilityReviews,
      EligibilityReviewTarget.Rider,
    )
    val storeOneStars = activeReviewedOrders.collect {
      case order
          if order.storeRating.contains(DeliveryValidationDefaults.ReviewRatingMin) &&
            isAfterReviewReset(order.updatedAt, latestStoreReviewReset.get(order.storeId)) =>
        order.storeId
    }
    val riderOneStars = activeReviewedOrders.collect {
      case order
          if order.riderRating.contains(DeliveryValidationDefaults.ReviewRatingMin) &&
            order.riderId.nonEmpty &&
            isAfterReviewReset(order.updatedAt, order.riderId.flatMap(latestRiderReviewReset.get)) =>
        order.riderId.get
    }
    val revenueByStore = state.orders
      .filter(_.status == OrderStatus.Completed)
      .groupBy(_.storeId)
      .view
      .mapValues(orders => orders.map(order => merchantIncomeForOrder(order)).sum)
      .toMap
    val completedOrderItemSubtotalCents = state.orders
      .filter(_.status == OrderStatus.Completed)
      .map(_.itemSubtotalCents)
      .sum
    val completedOrdersByCustomer = state.orders
      .filter(_.status == OrderStatus.Completed)
      .groupBy(_.customerId)
      .view
      .mapValues(_.sortBy(order => reviewEligibilityTimestamp(order)))
      .toMap
    val refundedCouponsByCustomer = state.orders
      .filter(order =>
        order.status == OrderStatus.Cancelled &&
          order.merchantRejectReason.nonEmpty &&
          order.appliedCoupon.nonEmpty,
      )
      .groupBy(_.customerId)
      .view
      .mapValues(orders => orders.flatMap(_.appliedCoupon))
      .toMap
    val monthlySpendByCustomer = state.orders
      .filter(order =>
        order.status == OrderStatus.Completed &&
          isWithinRecentWindow(order.updatedAt, currentTime, MonthlyWindowDays),
      )
      .groupBy(_.customerId)
      .view
      .mapValues(orders => orders.map(_.totalPriceCents).sum)
      .toMap
    val revokedCountsByCustomer = revokedReviewedOrders.groupBy(_.customerId).view.mapValues(orders => new EntityCount(orders.size)).toMap
    val nextCustomers = state.customers.map(customer =>
      val alias = customerAlias(customer.id)
      val monthlySpendCents = monthlySpendByCustomer.getOrElse(customer.id, NumericDefaults.ZeroCurrencyCents)
      val membershipTier =
        if monthlySpendCents > MemberMonthlySpendThresholdCents then MembershipTier.Member
        else MembershipTier.Standard
      customer.copy(
        name = alias,
        revokedReviewCount = revokedCountsByCustomer.getOrElse(customer.id, NumericDefaults.ZeroCount),
        accountStatus =
          if revokedCountsByCustomer.getOrElse(customer.id, NumericDefaults.ZeroCount) > CustomerBanThreshold then AccountStatus.Suspended
          else AccountStatus.Active,
        membershipTier = membershipTier,
        monthlySpendCents = monthlySpendCents,
        coupons = couponsForCustomer(
          customer.id,
          membershipTier,
          customer.coupons,
          refundedCouponsByCustomer.getOrElse(customer.id, List.empty),
          completedOrdersByCustomer.getOrElse(customer.id, List.empty),
          currentTime,
        ),
      )
    )
    val nextOrders = state.orders.map(order =>
      order.copy(
        customerName = customerAlias(order.customerId),
        chatMessages = order.chatMessages.map(message =>
          if message.senderRole == UserRole.customer then
            message.copy(senderName = customerAlias(order.customerId))
          else message
        ),
      )
    )
    val nextAppeals = state.reviewAppeals.map(appeal =>
      appeal.copy(customerName = customerAlias(appeal.customerId))
    )
    val nextStores = state.stores.map(store =>
      applyRatingToStore(
        store,
        ratingsForId(storeRatings, store.id),
        countById(storeOneStars, store.id),
        revenueByStore.getOrElse(store.id, NumericDefaults.ZeroCurrencyCents),
      )
    )
    val settledIncomeByMerchant = nextStores
      .groupBy(_.merchantName)
      .view
      .mapValues(stores => stores.map(_.revenueCents).sum)
      .toMap
    val nextRiders = state.riders.map(rider =>
      applyRatingToRider(
        rider,
        ratingsForId(riderRatings, rider.id),
        countById(riderOneStars, rider.id),
        riderIncomeForOrders(state.orders, rider.id),
      )
    )
    val merchantSettledIncomeCents = nextStores.map(_.revenueCents).sum
    val riderSettledIncomeCents = nextRiders.map(_.earningsCents).sum
    val platformIncomeCents =
      completedOrderItemSubtotalCents - merchantSettledIncomeCents - riderSettledIncomeCents
    val nextAdmins = state.admins.map(admin => admin.copy(platformIncomeCents = platformIncomeCents))
    val nextMerchantProfiles = mergeMerchantProfiles(state, settledIncomeByMerchant)
    val activeOrders = state.orders.count(order =>
      order.status == OrderStatus.PendingMerchantAcceptance ||
        order.status == OrderStatus.Preparing ||
        order.status == OrderStatus.ReadyForPickup ||
        order.status == OrderStatus.Delivering
    )

    state.copy(
      customers = nextCustomers,
      orders = nextOrders,
      reviewAppeals = nextAppeals,
      stores = nextStores,
      admins = nextAdmins,
      merchantProfiles = nextMerchantProfiles,
      riders = nextRiders,
      metrics = SystemMetrics(
        totalOrders = state.orders.size,
        activeOrders = activeOrders,
        resolvedTickets = state.tickets.count(_.status == TicketStatus.Resolved),
        averageRating = roundAverage(activeReviewedOrders.flatMap(order => List(order.storeRating, order.riderRating).flatten)),
      ),
    )

private def merchantIncomeForOrder(order: OrderSummary): CurrencyCents =
  order.itemSubtotalCents * MerchantRevenueShareNumerator / MerchantRevenueShareDenominator

private def riderIncomeForOrders(orders: List[OrderSummary], riderId: RiderId): CurrencyCents =
  orders.count(order => order.status == OrderStatus.Completed && order.riderId.contains(riderId)) * RiderEarningPerOrderCents

private def ratingsForId(entries: List[(EntityId, RatingValue)], id: EntityId): List[RatingValue] =
  entries.collect { case (`id`, rating) => rating }

private def countById(entries: List[EntityId], id: EntityId): EntityCount =
  entries.count(_ == id)

private def applyAutomaticDispatch(
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
            membershipByCustomer.getOrElse(order.customerId, NumericDefaults.ZeroCurrencyCents),
          ),
      )
      .sortBy(_.updatedAt)
    val initial = (state.orders, state.riders)
    val (nextOrders, nextRiders) = candidateOrders.foldLeft(initial) { case ((orders, riders), targetOrder) =>
      val availableRider = riders.find(_.availability == riderAvailable)
      availableRider match
        case Some(rider) =>
          val note =
            if autoDispatchMinutesForCustomer(
              membershipByCustomer.getOrElse(targetOrder.customerId, NumericDefaults.ZeroCurrencyCents)
            ) == MemberAutoDispatchMinutes
            then new DisplayText(List("系统已为会员订单优先指派骑手 ", rider.name.raw).mkString)
            else new DisplayText(List("系统已为超时订单指派骑手 ", rider.name.raw).mkString)
          val updatedOrders = orders.map(order =>
            if order.id == targetOrder.id then
              order.copy(
                riderId = Some(rider.id),
                riderName = Some(rider.name),
                updatedAt = currentTime,
                timeline = order.timeline :+ OrderTimelineEntry(OrderStatus.ReadyForPickup, note, currentTime),
              )
            else order
          )
          val updatedRiders = riders.map(entry =>
            if entry.id == rider.id then entry.copy(availability = riderOnDelivery) else entry
          )
          (updatedOrders, updatedRiders)
        case None => (orders, riders)
    }
    state.copy(orders = nextOrders, riders = nextRiders)

private def autoDispatchMinutesForCustomer(monthlySpendCents: CurrencyCents): DurationDays =
  if monthlySpendCents > MemberMonthlySpendThresholdCents then MemberAutoDispatchMinutes
  else StandardAutoDispatchMinutes

private def minutesBetween(from: IsoDateTime, to: IsoDateTime): DurationDays =
  java.time.Duration.between(Instant.parse(from.raw), Instant.parse(to.raw)).toMinutes

private def couponsForCustomer(
    customerId: CustomerId,
    membershipTier: MembershipTier,
    existingCoupons: List[Coupon],
    refundedCoupons: List[Coupon],
    completedOrders: List[OrderSummary],
    currentTime: IsoDateTime,
): List[Coupon] =
  val activeCoupons = existingCoupons.filterNot(coupon => isCouponExpired(coupon, currentTime))
  val activeRefundedCoupons = refundedCoupons.filterNot(coupon => isCouponExpired(coupon, currentTime))
  val spendRewardCoupons = spendingRewardCoupons(customerId, completedOrders, currentTime)
  val tierCoupons = membershipTier match
    case MembershipTier.Member =>
      val template = MemberTierCouponTemplate
      List(
        Coupon(
          id = List("coupon-", customerId, "-monthly").mkString,
          title = template.title,
          discountCents = template.discountCents,
          minimumSpendCents = template.minimumSpendCents,
          description = template.description,
          expiresAt = new IsoDateTime(Instant.parse(currentTime.raw).plusSeconds(MemberTierCouponValidityDays * TimeDefaults.SecondsPerDay).toString),
        )
      )
    case MembershipTier.Standard => List.empty

  (activeCoupons ++ activeRefundedCoupons ++ spendRewardCoupons ++ tierCoupons)
    .groupBy(_.id)
    .values
    .map(_.head)
    .toList
    .sortBy(_.expiresAt)

def initialRegistrationCoupons(customerId: CustomerId, currentTime: IsoDateTime): List[Coupon] =
  List.tabulate(WelcomeCouponCount) { index =>
    val template = WelcomeCouponTemplate
    Coupon(
      id = List("coupon-", customerId, "-welcome-", index + NumericDefaults.SingleItemCount).mkString,
      title = template.title,
      discountCents = template.discountCents,
      minimumSpendCents = template.minimumSpendCents,
      description = template.description,
      expiresAt = new IsoDateTime(Instant.parse(currentTime.raw).plusSeconds(CouponValidityDays * TimeDefaults.SecondsPerDay).toString),
    )
  }

private def spendingRewardCoupons(
    customerId: CustomerId,
    completedOrders: List[OrderSummary],
    currentTime: IsoDateTime,
): List[Coupon] =
  val (_, _, issuedCoupons) =
    completedOrders.foldLeft((NumericDefaults.ZeroCurrencyCents, NumericDefaults.ZeroCount, List.empty[Coupon])) {
      case ((accumulatedSpendCents, issuedCount, rewardCoupons), order) =>
        val nextAccumulatedSpendCents = accumulatedSpendCents + order.totalPriceCents
        val nextIssuedCount: EntityCount = nextAccumulatedSpendCents / CouponSpendStepCents

        if nextIssuedCount <= issuedCount then
          (nextAccumulatedSpendCents, issuedCount, rewardCoupons)
        else
          val newCoupons = (issuedCount.raw until nextIssuedCount.raw).toList.map { rewardIndex =>
            val template = SpendRewardCouponTemplates(rewardIndex % SpendRewardCouponTemplates.length)
            val issuedAt = parseInstant(reviewEligibilityTimestamp(order)).getOrElse(Instant.parse(currentTime.raw))
            Coupon(
              id = List("coupon-", customerId, "-spend-", rewardIndex + NumericDefaults.SingleItemCount).mkString,
              title = template.title,
              discountCents = template.discountCents,
              minimumSpendCents = template.minimumSpendCents,
              description = template.description,
              expiresAt = new IsoDateTime(issuedAt.plusSeconds(CouponValidityDays * TimeDefaults.SecondsPerDay).toString),
            )
          }

          (nextAccumulatedSpendCents, nextIssuedCount, rewardCoupons ++ newCoupons)
    }

  issuedCoupons.filterNot(coupon => isCouponExpired(coupon, currentTime))

private def isCouponExpired(coupon: Coupon, currentTime: IsoDateTime): ApprovalFlag =
  parseInstant(coupon.expiresAt).exists(_.isBefore(Instant.parse(currentTime.raw)))

private def applyRatingToStore(
    store: Store,
    ratings: List[RatingValue],
    oneStarCount: EntityCount,
    revenueCents: CurrencyCents,
): Store =
  store.copy(
      status =
        if oneStarCount > OneStarRevocationThreshold then storeRevoked
        else if store.status == storeBusy then storeBusy
        else storeOpen,
      averageRating = roundAverage(ratings),
      ratingCount = ratings.size,
      oneStarRatingCount = oneStarCount,
      revenueCents = revenueCents,
    )

private def applyRatingToRider(
    rider: Rider,
    ratings: List[RatingValue],
    oneStarCount: EntityCount,
    earningsCents: CurrencyCents,
): Rider =
  rider.copy(
      availability =
        if oneStarCount > OneStarRevocationThreshold then riderSuspended
        else if rider.availability == riderOnDelivery then riderOnDelivery
        else riderAvailable,
      averageRating = roundAverage(ratings),
      ratingCount = ratings.size,
      oneStarRatingCount = oneStarCount,
      earningsCents = earningsCents,
      availableToWithdrawCents = Math.max(NumericDefaults.ZeroCurrencyCents, earningsCents - rider.withdrawnCents),
    )

private def roundAverage(ratings: List[RatingValue]): AverageRating =
  if ratings.isEmpty then NumericDefaults.ZeroAverageRating
  else BigDecimal(ratings.sum.toDouble / ratings.size).setScale(TimeDefaults.ChronologicalScale, BigDecimal.RoundingMode.HALF_UP).toDouble

private def latestApprovedEligibilityReviewTimes(
    reviews: List[EligibilityReview],
    target: EligibilityReviewTarget,
): Map[EntityId, IsoDateTime] =
  reviews
      .filter(review => review.target == target && review.status == AppealStatus.Approved)
      .flatMap(review => review.reviewedAt.map(at => review.targetId -> at))
      .groupBy(_._1)
      .view
      .mapValues(entries => entries.map(_._2).max)
      .toMap

private def isAfterReviewReset(
    reviewTimestamp: IsoDateTime,
    resetTimestamp: Option[IsoDateTime],
): ApprovalFlag =
  resetTimestamp.forall(reset => Ordering[IsoDateTime].gteq(reviewTimestamp, reset))
