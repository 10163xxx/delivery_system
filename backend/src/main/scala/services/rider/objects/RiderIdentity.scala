package services.rider.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
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
