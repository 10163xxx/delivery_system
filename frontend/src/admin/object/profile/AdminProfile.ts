import type { AdminId, CurrencyCents, PersonName } from '@/shared/object/domain/DomainObjects'

export type AdminProfile = {
  id: AdminId
  name: PersonName
  platformIncomeCents: CurrencyCents
}
