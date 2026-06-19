// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
import type { EntityCount, RatingValue } from '@/objects/core/SharedObjects'

export type SystemMetrics = {
  totalOrders: EntityCount
  activeOrders: EntityCount
  resolvedTickets: EntityCount
  averageRating: RatingValue
}
