import type { AdminId, CurrencyCents, EntityCount, PersonName, RatingValue } from '@/shared/object/domain'

export type AdminProfile = {
  id: AdminId
  name: PersonName
  platformIncomeCents: CurrencyCents
}

export type SystemMetrics = {
  totalOrders: EntityCount
  activeOrders: EntityCount
  resolvedTickets: EntityCount
  averageRating: RatingValue
}
