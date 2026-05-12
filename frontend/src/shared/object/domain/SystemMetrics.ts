import type { EntityCount, RatingValue } from '@/shared/object/domain/DomainObjects'

export type SystemMetrics = {
  totalOrders: EntityCount
  activeOrders: EntityCount
  resolvedTickets: EntityCount
  averageRating: RatingValue
}
