package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class ReviewAppealDecision(
    appellantRole: AppealRole,
    reason: ReasonText,
)
object ReviewAppealDecision:
  given Encoder[ReviewAppealDecision] = deriveEncoder
  given Decoder[ReviewAppealDecision] = deriveDecoder
