package domain.auth

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class PersistedAuthAccount(
    id: AuthUserId,
    username: Username,
    passwordHash: PasswordHash,
    role: UserRole,
    displayName: PersonName,
    linkedProfileId: Option[EntityId],
    createdAt: IsoDateTime,
)
object PersistedAuthAccount:
  given Encoder[PersistedAuthAccount] = deriveEncoder
  given Decoder[PersistedAuthAccount] = deriveDecoder
