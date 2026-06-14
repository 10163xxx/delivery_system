import type {
  CurrencyCents,
  EntityCount,
  RatingValue,
} from '@/objects/core/SharedObjects'

export type RiderPerformance = {
  averageRating: RatingValue
  ratingCount: EntityCount
  oneStarRatingCount: EntityCount
  earningsCents: CurrencyCents
}
