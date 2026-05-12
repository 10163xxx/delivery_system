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
