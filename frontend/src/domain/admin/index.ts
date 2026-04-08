import type { AdminId, EntityCount, PersonName, RatingValue } from '../shared'

export type AdminProfile = {
  id: AdminId
  name: PersonName
}

export type SystemMetrics = {
  totalOrders: EntityCount
  activeOrders: EntityCount
  resolvedTickets: EntityCount
  averageRating: RatingValue
}
