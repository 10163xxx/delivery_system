package app.delivery

import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.rider.*
import domain.shared.*

import java.time.Instant

private[delivery] def refreshState(state: DeliveryAppState, currentTime: String): DeliveryAppState =
    withDerivedData(applyAutomaticDispatch(state, currentTime), currentTime)

private[delivery] def withDerivedData(state: DeliveryAppState): DeliveryAppState =
    withDerivedData(state, now())

private[delivery] def withDerivedData(state: DeliveryAppState, currentTime: String): DeliveryAppState =
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
          if order.storeRating.contains(1) &&
            isAfterReviewReset(order.updatedAt, latestStoreReviewReset.get(order.storeId)) =>
        order.storeId
    }
    val riderOneStars = activeReviewedOrders.collect {
      case order
          if order.riderRating.contains(1) &&
            order.riderId.nonEmpty &&
            isAfterReviewReset(order.updatedAt, order.riderId.flatMap(latestRiderReviewReset.get)) =>
        order.riderId.get
    }
    val revenueByStore = state.orders
      .filter(_.status == OrderStatus.Completed)
      .groupBy(_.storeId)
      .view
      .mapValues(orders => orders.map(_.itemSubtotalCents).sum)
      .toMap
    val completedOrdersByCustomer = state.orders
      .filter(_.status == OrderStatus.Completed)
      .groupBy(_.customerId)
      .view
      .mapValues(_.sortBy(order => reviewEligibilityTimestamp(order)))
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
    val revokedCountsByCustomer = revokedReviewedOrders.groupBy(_.customerId).view.mapValues(_.size).toMap
    val nextCustomers = state.customers.map(customer =>
      val alias = customerAlias(customer.id)
      val monthlySpendCents = monthlySpendByCustomer.getOrElse(customer.id, 0)
      val membershipTier =
        if monthlySpendCents > MemberMonthlySpendThresholdCents then MembershipTier.Member
        else MembershipTier.Standard
      customer.copy(
        name = alias,
        revokedReviewCount = revokedCountsByCustomer.getOrElse(customer.id, 0),
        accountStatus =
          if revokedCountsByCustomer.getOrElse(customer.id, 0) > CustomerBanThreshold then AccountStatus.Suspended
          else AccountStatus.Active,
        membershipTier = membershipTier,
        monthlySpendCents = monthlySpendCents,
        coupons = couponsForCustomer(
          customer.id,
          membershipTier,
          customer.coupons,
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
        revenueByStore.getOrElse(store.id, 0),
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
        state.orders.count(_.riderId.contains(rider.id)) * RiderEarningPerOrderCents,
      )
    )
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
      merchantProfiles = nextMerchantProfiles,
      riders = nextRiders,
      metrics = SystemMetrics(
        totalOrders = state.orders.size,
        activeOrders = activeOrders,
        resolvedTickets = state.tickets.count(_.status == TicketStatus.Resolved),
        averageRating = roundAverage(activeReviewedOrders.flatMap(order => List(order.storeRating, order.riderRating).flatten)),
      ),
    )

private def ratingsForId(entries: List[(String, Int)], id: String): List[Int] =
  entries.collect { case (`id`, rating) => rating }

private def countById(entries: List[String], id: String): Int =
  entries.count(_ == id)

private def applyAutomaticDispatch(
    state: DeliveryAppState,
    currentTime: String,
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
            membershipByCustomer.getOrElse(order.customerId, 0),
          ),
      )
      .sortBy(_.updatedAt)
    val initial = (state.orders, state.riders)
    val (nextOrders, nextRiders) = candidateOrders.foldLeft(initial) { case ((orders, riders), targetOrder) =>
      val availableRider = riders.find(_.availability == "Available")
      availableRider match
        case Some(rider) =>
          val note =
            if autoDispatchMinutesForCustomer(membershipByCustomer.getOrElse(targetOrder.customerId, 0)) == MemberAutoDispatchMinutes
            then s"系统已为会员订单优先指派骑手 ${rider.name}"
            else s"系统已为超时订单指派骑手 ${rider.name}"
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
            if entry.id == rider.id then entry.copy(availability = "OnDelivery") else entry
          )
          (updatedOrders, updatedRiders)
        case None => (orders, riders)
    }
    state.copy(orders = nextOrders, riders = nextRiders)

private def autoDispatchMinutesForCustomer(monthlySpendCents: Int): Long =
  if monthlySpendCents > MemberMonthlySpendThresholdCents then MemberAutoDispatchMinutes
  else StandardAutoDispatchMinutes

private def minutesBetween(from: String, to: String): Long =
  java.time.Duration.between(Instant.parse(from), Instant.parse(to)).toMinutes

private def couponsForCustomer(
    customerId: String,
    membershipTier: MembershipTier,
    existingCoupons: List[Coupon],
    completedOrders: List[OrderSummary],
    currentTime: String,
): List[Coupon] =
  val activeCoupons = existingCoupons.filterNot(coupon => isCouponExpired(coupon, currentTime))
    val spendRewardCoupons = spendingRewardCoupons(customerId, completedOrders, currentTime)
    val tierCoupons = membershipTier match
      case MembershipTier.Member =>
        val template = MemberTierCouponTemplate
        List(
          Coupon(
            id = s"coupon-$customerId-monthly",
            title = template.title,
            discountCents = template.discountCents,
            minimumSpendCents = template.minimumSpendCents,
            description = template.description,
            expiresAt = Instant.parse(currentTime).plusSeconds(MemberTierCouponValidityDays * 24L * 60L * 60L).toString,
          )
        )
      case MembershipTier.Standard => List.empty

    (activeCoupons ++ spendRewardCoupons ++ tierCoupons)
      .groupBy(_.id)
      .values
      .map(_.head)
      .toList
      .sortBy(_.expiresAt)

private[delivery] def initialRegistrationCoupons(customerId: String, currentTime: String): List[Coupon] =
    List.tabulate(WelcomeCouponCount) { index =>
      val template = WelcomeCouponTemplate
      Coupon(
        id = s"coupon-$customerId-welcome-${index + 1}",
        title = template.title,
        discountCents = template.discountCents,
        minimumSpendCents = template.minimumSpendCents,
        description = template.description,
        expiresAt = Instant.parse(currentTime).plusSeconds(CouponValidityDays * 24L * 60L * 60L).toString,
      )
    }

private def spendingRewardCoupons(
    customerId: String,
    completedOrders: List[OrderSummary],
    currentTime: String,
): List[Coupon] =
  val (_, _, coupons) = completedOrders.foldLeft((0, 0, List.empty[Coupon])) {
      case ((accumulatedSpendCents, issuedCount, rewardCoupons), order) =>
        val nextAccumulatedSpendCents = accumulatedSpendCents + order.totalPriceCents
        val nextIssuedCount = nextAccumulatedSpendCents / CouponSpendStepCents

        if nextIssuedCount <= issuedCount then
          (nextAccumulatedSpendCents, issuedCount, rewardCoupons)
        else
          val newCoupons = (issuedCount until nextIssuedCount).toList.map { rewardIndex =>
            val template = SpendRewardCouponTemplates(rewardIndex % SpendRewardCouponTemplates.length)
            val issuedAt = parseInstant(reviewEligibilityTimestamp(order)).getOrElse(Instant.parse(currentTime))
            Coupon(
              id = s"coupon-$customerId-spend-${rewardIndex + 1}",
              title = template.title,
              discountCents = template.discountCents,
              minimumSpendCents = template.minimumSpendCents,
              description = template.description,
              expiresAt = issuedAt.plusSeconds(CouponValidityDays * 24L * 60L * 60L).toString,
            )
          }

          (nextAccumulatedSpendCents, nextIssuedCount, rewardCoupons ++ newCoupons)
    }

    coupons.filterNot(coupon => isCouponExpired(coupon, currentTime))

private def isCouponExpired(coupon: Coupon, currentTime: String): Boolean =
  parseInstant(coupon.expiresAt).exists(_.isBefore(Instant.parse(currentTime)))

private def applyRatingToStore(
    store: Store,
    ratings: List[Int],
    oneStarCount: Int,
    revenueCents: Int,
): Store =
  store.copy(
      status =
        if oneStarCount > OneStarRevocationThreshold then "Revoked"
        else if store.status == "Busy" then "Busy"
        else "Open",
      averageRating = roundAverage(ratings),
      ratingCount = ratings.size,
      oneStarRatingCount = oneStarCount,
      revenueCents = revenueCents,
    )

private def applyRatingToRider(
    rider: Rider,
    ratings: List[Int],
    oneStarCount: Int,
    earningsCents: Int,
): Rider =
  rider.copy(
      availability =
        if oneStarCount > OneStarRevocationThreshold then "Suspended"
        else if rider.availability == "OnDelivery" then "OnDelivery"
        else "Available",
      averageRating = roundAverage(ratings),
      ratingCount = ratings.size,
      oneStarRatingCount = oneStarCount,
      earningsCents = earningsCents,
      availableToWithdrawCents = Math.max(0, earningsCents - rider.withdrawnCents),
    )

private def roundAverage(ratings: List[Int]): Double =
  if ratings.isEmpty then 0.0
  else BigDecimal(ratings.sum.toDouble / ratings.size).setScale(1, BigDecimal.RoundingMode.HALF_UP).toDouble

private def latestApprovedEligibilityReviewTimes(
    reviews: List[EligibilityReview],
    target: EligibilityReviewTarget,
): Map[String, String] =
  reviews
      .filter(review => review.target == target && review.status == AppealStatus.Approved)
      .flatMap(review => review.reviewedAt.map(at => review.targetId -> at))
      .groupBy(_._1)
      .view
      .mapValues(entries => entries.map(_._2).max)
      .toMap

private def isAfterReviewReset(
    reviewTimestamp: String,
    resetTimestamp: Option[String],
): Boolean =
  resetTimestamp.forall(reset => reviewTimestamp >= reset)

private def mergeMerchantProfiles(
    state: DeliveryAppState,
    settledIncomeByMerchant: Map[String, Int],
): List[MerchantProfile] =
  val merchantNames = (state.merchantProfiles.map(_.merchantName) ++ state.stores.map(_.merchantName)).distinct
    merchantNames.map { merchantName =>
      val existing = state.merchantProfiles.find(_.merchantName == merchantName)
      val profile = existing.getOrElse(
        MerchantProfile(
          id = nextId("merchant"),
          merchantName = merchantName,
          contactPhone = "",
          payoutAccount = None,
          settledIncomeCents = 0,
          withdrawnCents = 0,
          availableToWithdrawCents = 0,
          withdrawalHistory = List.empty,
        )
      )
      val settledIncomeCents = settledIncomeByMerchant.getOrElse(merchantName, 0)
      profile.copy(
        settledIncomeCents = settledIncomeCents,
        availableToWithdrawCents = Math.max(0, settledIncomeCents - profile.withdrawnCents),
        withdrawalHistory = profile.withdrawalHistory.sortBy(_.requestedAt)(Ordering.String.reverse),
      )
    }
