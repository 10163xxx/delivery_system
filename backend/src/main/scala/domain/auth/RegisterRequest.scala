package domain.auth

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class RegisterRequest(
    username: Username,
    password: Password,
    role: UserRole,
)
object RegisterRequest:
  given Encoder[RegisterRequest] = deriveEncoder
  given Decoder[RegisterRequest] = deriveDecoder
