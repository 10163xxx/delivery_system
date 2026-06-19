// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { PersonName } from '@/objects/core/SharedObjects'

export type UpdateCustomerProfileRequest = {
  name: PersonName
}
