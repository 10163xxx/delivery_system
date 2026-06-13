package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class SystemMetrics(
    totalOrders: EntityCount,
    activeOrders: EntityCount,
    resolvedTickets: EntityCount,
    averageRating: AverageRating,
)
object SystemMetrics:
  given Encoder[SystemMetrics] = deriveEncoder
  given Decoder[SystemMetrics] = deriveDecoder
