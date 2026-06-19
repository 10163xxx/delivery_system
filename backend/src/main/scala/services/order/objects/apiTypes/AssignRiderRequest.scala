package services.order.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.order.objects.*

import system.objects.given
import services.rider.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class AssignRiderRequest(riderId: RiderId)
object AssignRiderRequest:
  given Encoder[AssignRiderRequest] = deriveEncoder
  given Decoder[AssignRiderRequest] = deriveDecoder
