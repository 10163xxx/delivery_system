package domain.admin

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class AdminTicketIdentity(
    id: TicketId,
    orderId: OrderId,
    kind: TicketKind,
    status: TicketStatus,
    summary: SummaryText,
)
object AdminTicketIdentity:
  given Encoder[AdminTicketIdentity] = deriveEncoder
  given Decoder[AdminTicketIdentity] = deriveDecoder
