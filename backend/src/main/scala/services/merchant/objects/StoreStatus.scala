package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum StoreStatus:
  case Open, Busy, Revoked

object StoreStatus:
  private val enumLabel = text("StoreStatus")
  def render(value: StoreStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[StoreStatus] = parseEnumValue(value, StoreStatus.values)
  given Encoder[StoreStatus] = enumEncoder
  given Decoder[StoreStatus] = enumDecoder(StoreStatus.values, enumLabel)
