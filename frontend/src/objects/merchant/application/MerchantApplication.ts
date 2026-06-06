import type {
  AddressText,
  DeliveryCoordinate,
  DisplayText,
  ImageUrl,
  IsoDateTime,
  MerchantApplicationId,
  MerchantApplicationStatus,
  Minutes,
  NoteText,
  PersonName,
  ResolutionText,
} from '@/objects/domain/DomainObjects'
import type { BusinessHours } from '@/objects/merchant/store/BusinessHours'

export type MerchantApplicationIdentity = {
  id: MerchantApplicationId
  merchantName: PersonName
  storeName: DisplayText
  category: DisplayText
  storeAddress: AddressText
  location?: DeliveryCoordinate
}

export type MerchantApplicationSubmission = {
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
  imageUrl?: ImageUrl
  note?: NoteText
}

export type MerchantApplicationReview = {
  status: MerchantApplicationStatus
  reviewNote?: ResolutionText
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}

export type MerchantApplication = MerchantApplicationIdentity & MerchantApplicationSubmission & {
  review: MerchantApplicationReview
} & MerchantApplicationReview
