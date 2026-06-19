package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class StoreMetrics(
    averageRating: AverageRating,
    ratingCount: EntityCount,
    oneStarRatingCount: EntityCount,
    revenueCents: CurrencyCents,
)
object StoreMetrics:
  given Encoder[StoreMetrics] = deriveEncoder
  given Decoder[StoreMetrics] = deriveDecoder
