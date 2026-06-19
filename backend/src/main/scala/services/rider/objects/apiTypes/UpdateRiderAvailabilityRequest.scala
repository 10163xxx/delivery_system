package services.rider.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.rider.objects.*

import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateRiderAvailabilityRequest(
    availability: AvailabilityLabel,
)
object UpdateRiderAvailabilityRequest:
  given Encoder[UpdateRiderAvailabilityRequest] = deriveEncoder
  given Decoder[UpdateRiderAvailabilityRequest] = deriveDecoder
