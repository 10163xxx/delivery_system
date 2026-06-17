package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class StoreLocation(
    latitude: Latitude,
    longitude: Longitude,
)
object StoreLocation:
  given Encoder[StoreLocation] = deriveEncoder
  given Decoder[StoreLocation] = deriveDecoder
