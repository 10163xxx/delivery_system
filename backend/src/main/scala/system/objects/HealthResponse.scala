package system.objects

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

final case class HealthResponse(status: ServiceStatus, service: ServiceName)

object HealthResponse:
  given Encoder[HealthResponse] = deriveEncoder[HealthResponse]
  given Decoder[HealthResponse] = deriveDecoder[HealthResponse]
