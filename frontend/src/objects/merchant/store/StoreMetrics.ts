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
