package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class ResolveAfterSalesRequest(
    approved: ApprovalFlag,
    resolutionNote: ResolutionText,
    resolutionMode: Option[AfterSalesResolutionMode],
    actualCompensationCents: Option[CurrencyCents],
    couponMinimumSpendCents: Option[CurrencyCents],
)
object ResolveAfterSalesRequest:
  given Encoder[ResolveAfterSalesRequest] = deriveEncoder
  given Decoder[ResolveAfterSalesRequest] = deriveDecoder
