package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

final case class EchoResponse(message: DisplayText, transformed: ApprovalFlag)

object EchoResponse:
  given Encoder[EchoResponse] = deriveEncoder[EchoResponse]
  given Decoder[EchoResponse] = deriveDecoder[EchoResponse]
