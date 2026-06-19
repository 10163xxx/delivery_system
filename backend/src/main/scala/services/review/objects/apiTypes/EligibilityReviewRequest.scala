package services.review.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.review.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class EligibilityReviewRequest(
    target: EligibilityReviewTarget,
    targetId: EntityId,
    reason: ReasonText,
)
object EligibilityReviewRequest:
  given Encoder[EligibilityReviewRequest] = deriveEncoder
  given Decoder[EligibilityReviewRequest] = deriveDecoder
