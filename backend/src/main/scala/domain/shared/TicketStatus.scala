package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum TicketStatus:
  case Open, Resolved

object TicketStatus:
  private val enumLabel = text("TicketStatus")
  def render(value: TicketStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[TicketStatus] = parseEnumValue(value, TicketStatus.values)
  given Encoder[TicketStatus] = enumEncoder
  given Decoder[TicketStatus] = enumDecoder(TicketStatus.values, enumLabel)
