package services.review.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.review.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class ReviewAppealRequest(appellantRole: AppealRole, reason: ReasonText)
object ReviewAppealRequest:
  given Encoder[ReviewAppealRequest] = deriveEncoder
  given Decoder[ReviewAppealRequest] = deriveDecoder
