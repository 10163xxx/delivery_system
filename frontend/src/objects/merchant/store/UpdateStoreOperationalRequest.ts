import type { BusinessHours } from '@/objects/merchant/store/BusinessHours'
import type { AddressText, DeliveryCoordinate, Minutes } from '@/objects/domain/DomainObjects'

export type UpdateStoreOperationalRequest = {
  storeAddress: AddressText
  location?: DeliveryCoordinate
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
}
