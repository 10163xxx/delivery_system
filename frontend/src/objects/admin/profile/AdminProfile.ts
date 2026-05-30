import type { AdminId, CurrencyCents, PersonName } from '@/objects/domain/DomainObjects'

export type AdminProfile = {
  id: AdminId
  name: PersonName
  platformIncomeCents: CurrencyCents
}
