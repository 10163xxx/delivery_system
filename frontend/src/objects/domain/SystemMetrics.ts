import type { EntityCount, RatingValue } from '@/objects/core/SharedObjects'

export type SystemMetrics = {
  totalOrders: EntityCount
  activeOrders: EntityCount
  resolvedTickets: EntityCount
  averageRating: RatingValue
}
