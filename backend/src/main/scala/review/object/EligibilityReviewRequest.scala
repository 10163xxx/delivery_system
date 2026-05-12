package domain.review

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class EligibilityReviewRequest(
    target: EligibilityReviewTarget,
    targetId: EntityId,
    reason: ReasonText,
)
object EligibilityReviewRequest:
  given Encoder[EligibilityReviewRequest] = deriveEncoder
  given Decoder[EligibilityReviewRequest] = deriveDecoder
