package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum AccountStatus:
  case Active, Suspended

object AccountStatus:
  private val enumLabel = text("AccountStatus")
  def render(value: AccountStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AccountStatus] = parseEnumValue(value, AccountStatus.values)
  given Encoder[AccountStatus] = enumEncoder
  given Decoder[AccountStatus] = enumDecoder(AccountStatus.values, enumLabel)
