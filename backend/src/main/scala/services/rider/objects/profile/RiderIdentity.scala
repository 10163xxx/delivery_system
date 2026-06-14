package domain.rider

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class RiderIdentity(
    id: RiderId,
    name: PersonName,
    vehicle: VehicleLabel,
    zone: ZoneLabel,
    availability: AvailabilityLabel,
)
object RiderIdentity:
  given Encoder[RiderIdentity] = deriveEncoder
  given Decoder[RiderIdentity] = deriveDecoder
