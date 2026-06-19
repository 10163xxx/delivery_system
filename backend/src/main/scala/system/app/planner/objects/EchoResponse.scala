package system.app.planner.objects

// Business note: planner-owned demo object; keep frontend planner mirrors aligned when this shape crosses the planner API boundary.
import system.objects.given

import system.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

final case class EchoResponse(message: DisplayText, transformed: ApprovalFlag)

object EchoResponse:
  given Encoder[EchoResponse] = deriveEncoder[EchoResponse]
  given Decoder[EchoResponse] = deriveDecoder[EchoResponse]
