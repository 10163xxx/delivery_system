package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum PartialRefundStatus:
  case Pending, Approved, Rejected

object PartialRefundStatus:
  private val enumLabel = text("PartialRefundStatus")
  def render(value: PartialRefundStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[PartialRefundStatus] = parseEnumValue(value, PartialRefundStatus.values)
  given Encoder[PartialRefundStatus] = enumEncoder
  given Decoder[PartialRefundStatus] = enumDecoder(PartialRefundStatus.values, enumLabel)
