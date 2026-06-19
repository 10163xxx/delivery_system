// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AverageRating,
  CurrencyCents,
  EntityCount,
} from '@/objects/core/SharedObjects'

export type StoreMetrics = {
  averageRating: AverageRating
  ratingCount: EntityCount
  oneStarRatingCount: EntityCount
  revenueCents: CurrencyCents
}
