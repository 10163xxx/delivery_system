package domain.admin

import domain.shared.given

import domain.customer.Coupon
import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class AdminTicketResolution(
    actualCompensationCents: Option[CurrencyCents],
    approved: Option[ApprovalFlag],
    resolutionMode: Option[AfterSalesResolutionMode],
    issuedCoupon: Option[Coupon],
    reviewedAt: Option[IsoDateTime],
    resolutionNote: Option[ResolutionText],
)
object AdminTicketResolution:
  given Encoder[AdminTicketResolution] = deriveEncoder
  given Decoder[AdminTicketResolution] = deriveDecoder
