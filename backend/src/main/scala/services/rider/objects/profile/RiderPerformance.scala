package domain.rider

import domain.shared.given

import domain.shared.*
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
