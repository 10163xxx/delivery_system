package services.rider.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum RiderAvailability:
  case Available, OnDelivery, Unavailable, Suspended

object RiderAvailability:
  private val enumLabel = text("RiderAvailability")
  def render(value: RiderAvailability): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[RiderAvailability] = parseEnumValue(value, RiderAvailability.values)
  given Encoder[RiderAvailability] = enumEncoder
  given Decoder[RiderAvailability] = enumDecoder(RiderAvailability.values, enumLabel)
