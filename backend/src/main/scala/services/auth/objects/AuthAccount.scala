package services.auth.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class AuthAccount(
    id: AuthUserId,
    username: Username,
    role: UserRole,
    displayName: PersonName,
    linkedProfileId: Option[EntityId],
    createdAt: IsoDateTime,
)
object AuthAccount:
  given Encoder[AuthAccount] = deriveEncoder
  given Decoder[AuthAccount] = deriveDecoder
