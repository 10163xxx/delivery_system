package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum AppealStatus:
  case Pending, Approved, Rejected

object AppealStatus:
  private val enumLabel = text("AppealStatus")
  def render(value: AppealStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AppealStatus] = parseEnumValue(value, AppealStatus.values)
  given Encoder[AppealStatus] = enumEncoder
  given Decoder[AppealStatus] = enumDecoder(AppealStatus.values, enumLabel)
