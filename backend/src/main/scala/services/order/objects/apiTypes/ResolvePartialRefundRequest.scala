package services.order.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.order.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class ResolvePartialRefundRequest(
    approved: ApprovalFlag,
    resolutionNote: ResolutionText,
)
object ResolvePartialRefundRequest:
  given Encoder[ResolvePartialRefundRequest] = deriveEncoder
  given Decoder[ResolvePartialRefundRequest] = deriveDecoder
