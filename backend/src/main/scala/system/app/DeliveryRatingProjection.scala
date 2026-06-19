package system.app

// Business note: rating projection rules for store and rider derived metrics.
import system.objects.given

import services.merchant.objects.*
import services.review.objects.*
import services.rider.objects.*
import system.objects.*

def ratingsForId[T](
    entries: List[(T, RatingValue)],
    id: T,
): List[RatingValue] =
  entries.collect { case (`id`, rating) => rating }

def countById[T](entries: List[T], id: T): EntityCount =
  new EntityCount(entries.count(_ == id))

def applyRatingToStore(
    store: Store,
    ratings: List[RatingValue],
    oneStarCount: EntityCount,
    revenueCents: CurrencyCents,
): Store =
  val hasOrderRatings = ratings.nonEmpty
  store.copy(
    operations = store.operations.copy(
      status =
        if oneStarCount > OneStarRevocationThreshold then storeRevoked
        else if store.status == storeBusy then storeBusy
        else storeOpen,
    ),
    metrics = store.metrics.copy(
      averageRating = if hasOrderRatings then roundAverage(ratings) else store.averageRating,
      ratingCount = if hasOrderRatings then new EntityCount(ratings.size) else store.ratingCount,
      oneStarRatingCount = if hasOrderRatings then oneStarCount else store.oneStarRatingCount,
      revenueCents = revenueCents,
    ),
  )

def applyRatingToRider(
    rider: Rider,
    ratings: List[RatingValue],
    oneStarCount: EntityCount,
    earningsCents: CurrencyCents,
): Rider =
  rider.copy(
    identity = rider.identity.copy(
      availability =
        if oneStarCount > OneStarRevocationThreshold then riderSuspended
        else if rider.availability == riderOnDelivery then riderOnDelivery
        else if rider.availability == riderUnavailable then riderUnavailable
        else riderAvailable,
    ),
    performance = rider.performance.copy(
      averageRating = roundAverage(ratings),
      ratingCount = new EntityCount(ratings.size),
      oneStarRatingCount = oneStarCount,
      earningsCents = earningsCents,
    ),
    payout = rider.payout.copy(
      availableToWithdrawCents =
        maxCurrencyCents(
          NumericDefaults.ZeroCurrencyCents,
          earningsCents - rider.withdrawnCents,
        ),
    ),
  )

def roundAverage(ratings: List[RatingValue]): AverageRating =
  if ratings.isEmpty then NumericDefaults.ZeroAverageRating
  else
    new AverageRating(BigDecimal(ratings.sum.toDouble / ratings.size)
      .setScale(TimeDefaults.ChronologicalScale, BigDecimal.RoundingMode.HALF_UP)
      .toDouble)

def latestApprovedEligibilityReviewTimes(
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

def isAfterReviewReset(
    reviewTimestamp: IsoDateTime,
    resetTimestamp: Option[IsoDateTime],
): ApprovalFlag =
  new ApprovalFlag(resetTimestamp.forall(reset => Ordering[IsoDateTime].gteq(reviewTimestamp, reset)))
