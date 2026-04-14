package domain.auth

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AuthUser(
    id: AuthUserId,
    username: Username,
    role: UserRole,
    displayName: PersonName,
    linkedProfileId: Option[EntityId],
)
object AuthUser:
  given Encoder[AuthUser] = deriveEncoder
  given Decoder[AuthUser] = deriveDecoder

final case class AuthSessionResponse(token: SessionToken, user: AuthUser)
object AuthSessionResponse:
  given Encoder[AuthSessionResponse] = deriveEncoder
  given Decoder[AuthSessionResponse] = deriveDecoder

final case class LoginRequest(username: Username, password: Password, role: UserRole)
object LoginRequest:
  given Encoder[LoginRequest] = deriveEncoder
  given Decoder[LoginRequest] = deriveDecoder

final case class RegisterRequest(
    username: Username,
    password: Password,
    role: UserRole,
)
object RegisterRequest:
  given Encoder[RegisterRequest] = deriveEncoder
  given Decoder[RegisterRequest] = deriveDecoder
