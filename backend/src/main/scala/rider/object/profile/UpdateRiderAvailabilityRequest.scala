package domain.rider

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class UpdateRiderAvailabilityRequest(
    availability: AvailabilityLabel,
)
object UpdateRiderAvailabilityRequest:
  given Encoder[UpdateRiderAvailabilityRequest] = deriveEncoder
  given Decoder[UpdateRiderAvailabilityRequest] = deriveDecoder
