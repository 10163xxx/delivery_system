import type {
  DisplayText,
  ImageUrl,
  IsoDateTime,
  MerchantApplicationId,
  MerchantApplicationStatus,
  Minutes,
  NoteText,
  PersonName,
  ResolutionText,
  StoreCategory,
} from '@/shared/object/domain/DomainObjects'
import type { BusinessHours } from '@/merchant/object/store/BusinessHours'

export type MerchantApplicationIdentity = {
  id: MerchantApplicationId
  merchantName: PersonName
  storeName: DisplayText
  category: StoreCategory
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
