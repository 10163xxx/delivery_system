package domain.admin

import domain.shared.given

import domain.shared.*
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
