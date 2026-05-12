package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ResolvePartialRefundRequest(
    approved: ApprovalFlag,
    resolutionNote: ResolutionText,
)
object ResolvePartialRefundRequest:
  given Encoder[ResolvePartialRefundRequest] = deriveEncoder
  given Decoder[ResolvePartialRefundRequest] = deriveDecoder
