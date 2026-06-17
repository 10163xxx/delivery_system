package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

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
