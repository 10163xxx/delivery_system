// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
