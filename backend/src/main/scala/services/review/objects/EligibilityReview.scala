package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

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
