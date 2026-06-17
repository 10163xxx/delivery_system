package domain.customer

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class CustomerLocation(
    latitude: Latitude,
    longitude: Longitude,
)
object CustomerLocation:
  given Encoder[CustomerLocation] = deriveEncoder
  given Decoder[CustomerLocation] = deriveDecoder
