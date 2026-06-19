package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.order.objects.*
import services.auth.objects.*

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class AdminTicketSubmission(
    requestType: Option[AfterSalesRequestType],
    submittedByRole: Option[UserRole],
    submittedByName: Option[PersonName],
    expectedCompensationCents: Option[CurrencyCents],
    submittedAt: IsoDateTime,
)
object AdminTicketSubmission:
  given Encoder[AdminTicketSubmission] = deriveEncoder
  given Decoder[AdminTicketSubmission] = deriveDecoder
