package services.auth.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
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
