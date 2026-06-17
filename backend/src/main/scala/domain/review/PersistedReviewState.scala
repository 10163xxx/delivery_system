package domain.review

// Backend-only persistence aggregate for review tables. This shape is used when
// loading database state and is not mirrored by frontend protocol objects.
final case class PersistedReviewState(
    reviewAppeals: List[ReviewAppeal],
    eligibilityReviews: List[EligibilityReview],
)
