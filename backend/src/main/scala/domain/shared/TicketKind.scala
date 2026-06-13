package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum TicketKind:
  case PositiveReview, NegativeReview, DeliveryIssue

object TicketKind:
  private val enumLabel = text("TicketKind")
  def render(value: TicketKind): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[TicketKind] = parseEnumValue(value, TicketKind.values)
  given Encoder[TicketKind] = enumEncoder
  given Decoder[TicketKind] = enumDecoder(TicketKind.values, enumLabel)
