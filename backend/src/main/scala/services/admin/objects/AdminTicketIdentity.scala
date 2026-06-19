package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.order.objects.*

import system.objects.*
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
