package domain.admin

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class AdminTicketLifecycle(
    updatedAt: IsoDateTime,
)
object AdminTicketLifecycle:
  given Encoder[AdminTicketLifecycle] = deriveEncoder
  given Decoder[AdminTicketLifecycle] = deriveDecoder
