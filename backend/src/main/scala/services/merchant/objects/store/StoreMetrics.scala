package domain.merchant

import domain.shared.given

import domain.shared.*
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
