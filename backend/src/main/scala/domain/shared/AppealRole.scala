package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum AppealRole:
  case Merchant, Rider

object AppealRole:
  private val enumLabel = text("AppealRole")
  def render(value: AppealRole): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AppealRole] = parseEnumValue(value, AppealRole.values)
  given Encoder[AppealRole] = enumEncoder
  given Decoder[AppealRole] = enumDecoder(AppealRole.values, enumLabel)
