package system.objects

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

final case class ErrorResponse(message: DisplayText)

object ErrorResponse:
  given Encoder[ErrorResponse] = deriveEncoder[ErrorResponse]
  given Decoder[ErrorResponse] = deriveDecoder[ErrorResponse]
