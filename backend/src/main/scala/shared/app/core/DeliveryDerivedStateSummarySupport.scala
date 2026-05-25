package shared.app

import domain.shared.given

import domain.admin.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.rider.*
import domain.shared.*

private[app] final case class ReviewDerivedCollections(
    activeReviewedOrders: List[OrderSummary],
    revokedReviewedOrders: List[OrderSummary],
    storeRatings: List[(StoreId, RatingValue)],
    riderRatings: List[(RiderId, RatingValue)],
    storeOneStars: List[StoreId],
    riderOneStars: List[RiderId],
)

private[app] def collectReviewDerivedCollections(
    state: DeliveryAppState
): ReviewDerivedCollections =
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
          isAfterReviewReset(order.updatedAt, order.riderId.flatMap(riderId => latestRiderReviewReset.get(new EntityId(riderId.raw)))) =>
      order.riderId.get
  }

  ReviewDerivedCollections(
    activeReviewedOrders = activeReviewedOrders,
    revokedReviewedOrders = revokedReviewedOrders,
    storeRatings = storeRatings,
    riderRatings = riderRatings,
    storeOneStars = storeOneStars,
    riderOneStars = riderOneStars,
  )

private[app] def revenueByStore(
    orders: List[OrderSummary]
): Map[StoreId, CurrencyCents] =
  orders
    .filter(_.status == OrderStatus.Completed)
    .groupBy(_.storeId)
    .view
    .mapValues(orders => orders.map(order => merchantIncomeForOrder(order)).sum)
    .toMap

private[app] def completedOrderItemSubtotalCents(
    orders: List[OrderSummary]
): CurrencyCents =
  orders
    .filter(_.status == OrderStatus.Completed)
    .map(_.itemSubtotalCents)
    .sum

private[app] def deriveStores(
    stores: List[Store],
    ratings: ReviewDerivedCollections,
    storeRevenue: Map[StoreId, CurrencyCents],
): List[Store] =
  stores.map(store =>
    applyRatingToStore(
      store,
      ratingsForId(ratings.storeRatings, store.id),
      countById(ratings.storeOneStars, store.id),
      storeRevenue.getOrElse(store.id, NumericDefaults.ZeroCurrencyCents),
    )
  )

private[app] def settledIncomeByMerchant(
    stores: List[Store]
): Map[PersonName, CurrencyCents] =
  stores
    .groupBy(_.merchantName)
    .view
    .mapValues(stores => stores.map(_.revenueCents).sum)
    .toMap

private[app] def deriveRiders(
    riders: List[Rider],
    orders: List[OrderSummary],
    ratings: ReviewDerivedCollections,
): List[Rider] =
  riders.map(rider =>
    applyRatingToRider(
      rider,
      ratingsForId(ratings.riderRatings, rider.id),
      countById(ratings.riderOneStars, rider.id),
      riderIncomeForOrders(orders, rider.id),
    )
  )

private[app] def deriveAdmins(
    admins: List[AdminProfile],
    completedItemSubtotalCents: CurrencyCents,
    stores: List[Store],
    riders: List[Rider],
): List[AdminProfile] =
  val merchantSettledIncomeCents = stores.map(_.revenueCents).sum
  val riderSettledIncomeCents = riders.map(_.earningsCents).sum
  val platformIncomeCents =
    completedItemSubtotalCents - merchantSettledIncomeCents - riderSettledIncomeCents
  admins.map(admin => admin.copy(platformIncomeCents = platformIncomeCents))

private[app] def activeOrderCount(
    orders: List[OrderSummary]
): EntityCount =
  orders.count(order =>
    order.status == OrderStatus.PendingMerchantAcceptance ||
      order.status == OrderStatus.Preparing ||
      order.status == OrderStatus.ReadyForPickup ||
      order.status == OrderStatus.Delivering
  )

private[app] def deriveSystemMetrics(
    state: DeliveryAppState,
    activeReviewedOrders: List[OrderSummary],
): SystemMetrics =
  SystemMetrics(
    totalOrders = state.orders.size,
    activeOrders = activeOrderCount(state.orders),
    resolvedTickets = state.tickets.count(_.status == TicketStatus.Resolved),
    averageRating = roundAverage(
      activeReviewedOrders.flatMap(order => List(order.storeRating, order.riderRating).flatten)
    ),
  )
