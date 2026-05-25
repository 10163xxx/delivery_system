package domain.auth

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AuthSession(token: SessionToken, user: AuthUser)
object AuthSession:
  given Encoder[AuthSession] = deriveEncoder
  given Decoder[AuthSession] = deriveDecoder
