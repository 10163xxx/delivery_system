package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum AccountStatus:
  case Active, Suspended

object AccountStatus:
  private val enumLabel = text("AccountStatus")
  def render(value: AccountStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AccountStatus] = parseEnumValue(value, AccountStatus.values)
  given Encoder[AccountStatus] = enumEncoder
  given Decoder[AccountStatus] = enumDecoder(AccountStatus.values, enumLabel)
