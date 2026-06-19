package services.review.objects

// Alignment note: backend-only persistence aggregate for review tables. Frontend
// protocol objects intentionally do not mirror this database loading shape.
final case class PersistedReviewState(
    reviewAppeals: List[ReviewAppeal],
    eligibilityReviews: List[EligibilityReview],
)
