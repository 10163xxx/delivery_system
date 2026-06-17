package domain.review

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class ReviewAppealDecision(
    appellantRole: AppealRole,
    reason: ReasonText,
)
object ReviewAppealDecision:
  given Encoder[ReviewAppealDecision] = deriveEncoder
  given Decoder[ReviewAppealDecision] = deriveDecoder
