package domain.auth

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.UserRole

final case class AuthUser(
    id: String,
    username: String,
    role: UserRole,
    displayName: String,
    linkedProfileId: Option[String],
)
object AuthUser:
  given Encoder[AuthUser] = deriveEncoder
  given Decoder[AuthUser] = deriveDecoder

final case class AuthSessionResponse(token: String, user: AuthUser)
object AuthSessionResponse:
  given Encoder[AuthSessionResponse] = deriveEncoder
  given Decoder[AuthSessionResponse] = deriveDecoder

final case class LoginRequest(username: String, password: String)
object LoginRequest:
  given Encoder[LoginRequest] = deriveEncoder
  given Decoder[LoginRequest] = deriveDecoder

final case class RegisterRequest(
    username: String,
    password: String,
    role: UserRole,
)
object RegisterRequest:
  given Encoder[RegisterRequest] = deriveEncoder
  given Decoder[RegisterRequest] = deriveDecoder
