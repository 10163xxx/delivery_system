// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { AdminId, CurrencyCents, PersonName } from '@/objects/core/SharedObjects'

export type AdminProfile = {
  id: AdminId
  name: PersonName
  platformIncomeCents: CurrencyCents
}
