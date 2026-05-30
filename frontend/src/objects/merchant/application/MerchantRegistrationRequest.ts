import type {
  AddressText,
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
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
  imageUrl?: ImageUrl
  note?: NoteText
}
