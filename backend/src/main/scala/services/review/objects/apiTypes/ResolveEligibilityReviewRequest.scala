package services.review.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.review.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class ResolveEligibilityReviewRequest(approved: ApprovalFlag, resolutionNote: ResolutionText)
object ResolveEligibilityReviewRequest:
  given Encoder[ResolveEligibilityReviewRequest] = deriveEncoder
  given Decoder[ResolveEligibilityReviewRequest] = deriveDecoder
