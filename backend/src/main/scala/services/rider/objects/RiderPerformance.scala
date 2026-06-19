package services.rider.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class RiderPerformance(
    averageRating: AverageRating,
    ratingCount: EntityCount,
    oneStarRatingCount: EntityCount,
    earningsCents: CurrencyCents,
)
object RiderPerformance:
  given Encoder[RiderPerformance] = deriveEncoder
  given Decoder[RiderPerformance] = deriveDecoder
