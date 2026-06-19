package services.review.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.review.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class ResolveReviewAppealRequest(approved: ApprovalFlag, resolutionNote: ResolutionText)
object ResolveReviewAppealRequest:
  given Encoder[ResolveReviewAppealRequest] = deriveEncoder
  given Decoder[ResolveReviewAppealRequest] = deriveDecoder
