// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { BusinessHours } from '@/objects/merchant/store/BusinessHours'
import type { AddressText, DeliveryCoordinate, Minutes } from '@/objects/core/SharedObjects'

export type UpdateStoreOperationalRequest = {
  storeAddress: AddressText
  location?: DeliveryCoordinate
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
}
