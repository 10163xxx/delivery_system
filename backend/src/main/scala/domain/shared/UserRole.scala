package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum UserRole:
  case customer, merchant, rider, admin

object UserRole:
  private val enumLabel = text("UserRole")
  def render(value: UserRole): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[UserRole] = parseEnumValue(value, UserRole.values)
  given Encoder[UserRole] = enumEncoder
  given Decoder[UserRole] = enumDecoder(UserRole.values, enumLabel)
