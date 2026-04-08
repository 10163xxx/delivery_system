package domain.review

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ReviewAppeal(
    id: String,
    orderId: String,
    customerId: String,
    customerName: String,
    storeId: String,
    riderId: Option[String],
    appellantRole: AppealRole,
    reason: String,
    status: AppealStatus,
    resolutionNote: Option[String],
    submittedAt: String,
    reviewedAt: Option[String],
)
object ReviewAppeal:
  given Encoder[ReviewAppeal] = deriveEncoder
  given Decoder[ReviewAppeal] = deriveDecoder

final case class ReviewAppealRequest(appellantRole: AppealRole, reason: String)
object ReviewAppealRequest:
  given Encoder[ReviewAppealRequest] = deriveEncoder
  given Decoder[ReviewAppealRequest] = deriveDecoder

final case class ResolveReviewAppealRequest(approved: Boolean, resolutionNote: String)
object ResolveReviewAppealRequest:
  given Encoder[ResolveReviewAppealRequest] = deriveEncoder
  given Decoder[ResolveReviewAppealRequest] = deriveDecoder

final case class EligibilityReviewRequest(
    target: EligibilityReviewTarget,
    targetId: String,
    reason: String,
)
object EligibilityReviewRequest:
  given Encoder[EligibilityReviewRequest] = deriveEncoder
  given Decoder[EligibilityReviewRequest] = deriveDecoder

final case class ResolveEligibilityReviewRequest(approved: Boolean, resolutionNote: String)
object ResolveEligibilityReviewRequest:
  given Encoder[ResolveEligibilityReviewRequest] = deriveEncoder
  given Decoder[ResolveEligibilityReviewRequest] = deriveDecoder

final case class EligibilityReview(
    id: String,
    target: EligibilityReviewTarget,
    targetId: String,
    targetName: String,
    reason: String,
    status: AppealStatus,
    resolutionNote: Option[String],
    submittedAt: String,
    reviewedAt: Option[String],
)
object EligibilityReview:
  given Encoder[EligibilityReview] = deriveEncoder
  given Decoder[EligibilityReview] = deriveDecoder

final case class ReviewSubmission(
    rating: Int,
    comment: Option[String],
    extraNote: Option[String],
)
object ReviewSubmission:
  given Encoder[ReviewSubmission] = deriveEncoder
  given Decoder[ReviewSubmission] = deriveDecoder

final case class ReviewOrderRequest(
    storeReview: Option[ReviewSubmission],
    riderReview: Option[ReviewSubmission],
)
object ReviewOrderRequest:
  given Encoder[ReviewOrderRequest] = deriveEncoder
  given Decoder[ReviewOrderRequest] = deriveDecoder
