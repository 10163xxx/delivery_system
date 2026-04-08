package domain.shared

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

final case class EchoResponse(message: String, transformed: Boolean)

object EchoResponse:
  given Encoder[EchoResponse] = deriveEncoder[EchoResponse]
  given Decoder[EchoResponse] = deriveDecoder[EchoResponse]
