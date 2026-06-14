import type {
  AddressText,
  ImageUrl,
  Minutes,
  StoreStatus,
} from '@/objects/core/SharedObjects'
import type { MenuItem } from '@/objects/merchant/menu/MenuItem'
import type { BusinessHours } from '@/objects/merchant/store/BusinessHours'
import type { StoreLocation } from '@/objects/merchant/store/StoreLocation'

export type StoreOperations = {
  status: StoreStatus
  storeAddress: AddressText
  location?: StoreLocation
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
  imageUrl?: ImageUrl
  menu: MenuItem[]
}
