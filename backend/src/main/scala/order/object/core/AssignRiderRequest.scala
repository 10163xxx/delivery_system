package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AssignRiderRequest(riderId: RiderId)
object AssignRiderRequest:
  given Encoder[AssignRiderRequest] = deriveEncoder
  given Decoder[AssignRiderRequest] = deriveDecoder
