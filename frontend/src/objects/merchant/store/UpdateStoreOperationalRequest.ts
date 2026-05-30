import type { BusinessHours } from '@/objects/merchant/store/BusinessHours'
import type { AddressText, Minutes } from '@/objects/domain/DomainObjects'

export type UpdateStoreOperationalRequest = {
  storeAddress: AddressText
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
}
