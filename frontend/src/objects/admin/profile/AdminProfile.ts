import type { AdminId, CurrencyCents, PersonName } from '@/objects/core/SharedObjects'

export type AdminProfile = {
  id: AdminId
  name: PersonName
  platformIncomeCents: CurrencyCents
}
