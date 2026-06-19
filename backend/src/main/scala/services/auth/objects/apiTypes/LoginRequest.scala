package services.auth.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.auth.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class LoginRequest(username: Username, password: Password, role: UserRole)
object LoginRequest:
  given Encoder[LoginRequest] = deriveEncoder
  given Decoder[LoginRequest] = deriveDecoder
