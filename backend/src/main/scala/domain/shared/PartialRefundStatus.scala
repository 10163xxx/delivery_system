package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum PartialRefundStatus:
  case Pending, Approved, Rejected

object PartialRefundStatus:
  private val enumLabel = text("PartialRefundStatus")
  def render(value: PartialRefundStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[PartialRefundStatus] = parseEnumValue(value, PartialRefundStatus.values)
  given Encoder[PartialRefundStatus] = enumEncoder
  given Decoder[PartialRefundStatus] = enumDecoder(PartialRefundStatus.values, enumLabel)
