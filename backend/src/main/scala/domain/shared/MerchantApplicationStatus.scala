package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum MerchantApplicationStatus:
  case Pending, Approved, Rejected

object MerchantApplicationStatus:
  private val enumLabel = text("MerchantApplicationStatus")
  def render(value: MerchantApplicationStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[MerchantApplicationStatus] = parseEnumValue(value, MerchantApplicationStatus.values)
  given Encoder[MerchantApplicationStatus] = enumEncoder
  given Decoder[MerchantApplicationStatus] = enumDecoder(MerchantApplicationStatus.values, enumLabel)
