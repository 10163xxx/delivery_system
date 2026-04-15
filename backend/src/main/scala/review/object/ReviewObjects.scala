package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ReviewAppeal(
    id: ReviewAppealId,
    orderId: OrderId,
    customerId: CustomerId,
    customerName: PersonName,
    storeId: StoreId,
    riderId: Option[RiderId],
    appellantRole: AppealRole,
    reason: ReasonText,
    status: AppealStatus,
    resolutionNote: Option[ResolutionText],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
)
object ReviewAppeal:
  given Encoder[ReviewAppeal] = deriveEncoder
  given Decoder[ReviewAppeal] = deriveDecoder

final case class ReviewAppealRequest(appellantRole: AppealRole, reason: ReasonText)
object ReviewAppealRequest:
  given Encoder[ReviewAppealRequest] = deriveEncoder
  given Decoder[ReviewAppealRequest] = deriveDecoder

final case class ResolveReviewAppealRequest(approved: ApprovalFlag, resolutionNote: ResolutionText)
object ResolveReviewAppealRequest:
  given Encoder[ResolveReviewAppealRequest] = deriveEncoder
  given Decoder[ResolveReviewAppealRequest] = deriveDecoder

final case class EligibilityReviewRequest(
    target: EligibilityReviewTarget,
    targetId: EntityId,
    reason: ReasonText,
)
object EligibilityReviewRequest:
  given Encoder[EligibilityReviewRequest] = deriveEncoder
  given Decoder[EligibilityReviewRequest] = deriveDecoder

final case class ResolveEligibilityReviewRequest(approved: ApprovalFlag, resolutionNote: ResolutionText)
object ResolveEligibilityReviewRequest:
  given Encoder[ResolveEligibilityReviewRequest] = deriveEncoder
  given Decoder[ResolveEligibilityReviewRequest] = deriveDecoder

final case class EligibilityReview(
    id: EligibilityReviewId,
    target: EligibilityReviewTarget,
    targetId: EntityId,
    targetName: DisplayText,
    reason: ReasonText,
    status: AppealStatus,
    resolutionNote: Option[ResolutionText],
    submittedAt: IsoDateTime,
    reviewedAt: Option[IsoDateTime],
)
object EligibilityReview:
  given Encoder[EligibilityReview] = deriveEncoder
  given Decoder[EligibilityReview] = deriveDecoder

final case class ReviewSubmission(
    rating: RatingValue,
    comment: Option[ReasonText],
    extraNote: Option[NoteText],
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
