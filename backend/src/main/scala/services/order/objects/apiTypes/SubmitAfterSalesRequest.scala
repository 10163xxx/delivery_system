package services.order.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.order.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class SubmitAfterSalesRequest(
    requestType: AfterSalesRequestType,
    reason: ReasonText,
    expectedCompensationCents: Option[CurrencyCents],
)
object SubmitAfterSalesRequest:
  given Encoder[SubmitAfterSalesRequest] = deriveEncoder
  given Decoder[SubmitAfterSalesRequest] = deriveDecoder
