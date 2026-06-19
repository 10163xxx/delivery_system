package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.order.objects.*

import services.customer.objects.Coupon
import system.objects.*
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
