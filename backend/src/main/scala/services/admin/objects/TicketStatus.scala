package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum TicketStatus:
  case Open, Resolved

object TicketStatus:
  private val enumLabel = text("TicketStatus")
  def render(value: TicketStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[TicketStatus] = parseEnumValue(value, TicketStatus.values)
  given Encoder[TicketStatus] = enumEncoder
  given Decoder[TicketStatus] = enumDecoder(TicketStatus.values, enumLabel)
