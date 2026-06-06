import type {
  AddressText,
  DeliveryCoordinate,
  DisplayText,
  ImageUrl,
  Minutes,
  NoteText,
  PersonName,
} from '@/objects/domain/DomainObjects'
import type { BusinessHours } from '@/objects/merchant/store/BusinessHours'

export type MerchantRegistrationRequest = {
  merchantName: PersonName
  storeName: DisplayText
  category: DisplayText
  storeAddress: AddressText
  location?: DeliveryCoordinate
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
  imageUrl?: ImageUrl
  note?: NoteText
}
