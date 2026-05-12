package domain.auth

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AuthAccount(
    id: AuthUserId,
    username: Username,
    password: Password,
    role: UserRole,
    displayName: PersonName,
    linkedProfileId: Option[EntityId],
    createdAt: IsoDateTime,
)
object AuthAccount:
  given Encoder[AuthAccount] = deriveEncoder
  given Decoder[AuthAccount] = deriveDecoder

final case class AuthState(
    accounts: List[AuthAccount],
    sessions: Map[SessionToken, AuthUserId],
)
object AuthState:
  given Encoder[AuthState] = deriveEncoder
  given Decoder[AuthState] = deriveDecoder
