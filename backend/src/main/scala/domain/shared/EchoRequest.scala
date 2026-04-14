package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

final case class EchoRequest(message: DisplayText, uppercase: ApprovalFlag)

object EchoRequest:
  given Encoder[EchoRequest] = deriveEncoder[EchoRequest]
  given Decoder[EchoRequest] = deriveDecoder[EchoRequest]
