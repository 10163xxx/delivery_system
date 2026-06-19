package system.app.objects

// Business note: system-owned application object; mirror it in the frontend only when it is part of protocol or shared app state.
import system.objects.given
import system.objects.*

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
