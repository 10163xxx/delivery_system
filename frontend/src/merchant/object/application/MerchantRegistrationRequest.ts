import type {
  DisplayText,
  ImageUrl,
  Minutes,
  NoteText,
  PersonName,
  StoreCategory,
} from '@/shared/object/domain/DomainObjects'
import type { BusinessHours } from '@/merchant/object/store/BusinessHours'

export type MerchantRegistrationRequest = {
  merchantName: PersonName
  storeName: DisplayText
  category: StoreCategory
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
  imageUrl?: ImageUrl
  note?: NoteText
}
