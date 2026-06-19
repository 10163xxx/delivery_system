package services.auth.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class AuthSession(token: SessionToken, user: AuthAccount)
object AuthSession:
  given Encoder[AuthSession] = deriveEncoder
  given Decoder[AuthSession] = deriveDecoder
