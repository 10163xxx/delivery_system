package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class SubmitPartialRefundRequest(
    menuItemId: MenuItemId,
    quantity: Quantity,
    reason: ReasonText,
)
object SubmitPartialRefundRequest:
  given Encoder[SubmitPartialRefundRequest] = deriveEncoder
  given Decoder[SubmitPartialRefundRequest] = deriveDecoder
