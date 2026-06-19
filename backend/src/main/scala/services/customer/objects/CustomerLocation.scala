package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class CustomerLocation(
    latitude: Latitude,
    longitude: Longitude,
)
object CustomerLocation:
  given Encoder[CustomerLocation] = deriveEncoder
  given Decoder[CustomerLocation] = deriveDecoder
