package services.auth.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.auth.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class RegisterRequest(
    username: Username,
    password: Password,
    role: UserRole,
)
object RegisterRequest:
  given Encoder[RegisterRequest] = deriveEncoder
  given Decoder[RegisterRequest] = deriveDecoder
