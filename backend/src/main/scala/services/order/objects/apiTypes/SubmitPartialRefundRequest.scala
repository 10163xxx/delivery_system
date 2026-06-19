package services.order.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.order.objects.*

import system.objects.given
import services.merchant.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class SubmitPartialRefundRequest(
    menuItemId: MenuItemId,
    quantity: Quantity,
    reason: ReasonText,
)
object SubmitPartialRefundRequest:
  given Encoder[SubmitPartialRefundRequest] = deriveEncoder
  given Decoder[SubmitPartialRefundRequest] = deriveDecoder
