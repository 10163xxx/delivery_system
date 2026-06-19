package services.auth.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum UserRole:
  case customer, merchant, rider, admin

object UserRole:
  private val enumLabel = text("UserRole")
  def render(value: UserRole): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[UserRole] = parseEnumValue(value, UserRole.values)
  given Encoder[UserRole] = enumEncoder
  given Decoder[UserRole] = enumDecoder(UserRole.values, enumLabel)
