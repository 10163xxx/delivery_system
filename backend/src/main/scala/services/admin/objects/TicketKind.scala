package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum TicketKind:
  case PositiveReview, NegativeReview, DeliveryIssue

object TicketKind:
  private val enumLabel = text("TicketKind")
  def render(value: TicketKind): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[TicketKind] = parseEnumValue(value, TicketKind.values)
  given Encoder[TicketKind] = enumEncoder
  given Decoder[TicketKind] = enumDecoder(TicketKind.values, enumLabel)
