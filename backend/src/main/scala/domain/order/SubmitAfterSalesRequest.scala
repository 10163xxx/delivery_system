package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class SubmitAfterSalesRequest(
    requestType: AfterSalesRequestType,
    reason: ReasonText,
    expectedCompensationCents: Option[CurrencyCents],
)
object SubmitAfterSalesRequest:
  given Encoder[SubmitAfterSalesRequest] = deriveEncoder
  given Decoder[SubmitAfterSalesRequest] = deriveDecoder
