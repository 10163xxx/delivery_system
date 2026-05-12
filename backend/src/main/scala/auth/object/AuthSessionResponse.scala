package domain.auth

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AuthSessionResponse(token: SessionToken, user: AuthUser)
object AuthSessionResponse:
  given Encoder[AuthSessionResponse] = deriveEncoder
  given Decoder[AuthSessionResponse] = deriveDecoder
