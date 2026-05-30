import type { EntityCount, RatingValue } from '@/objects/domain/DomainObjects'

export type SystemMetrics = {
  totalOrders: EntityCount
  activeOrders: EntityCount
  resolvedTickets: EntityCount
  averageRating: RatingValue
}
