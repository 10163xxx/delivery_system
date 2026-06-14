import type {
  AddressText,
  DisplayText,
  ImageUrl,
  Minutes,
  NoteText,
  PersonName,
  StoreCategory,
  TimeOfDay,
} from '@/objects/core/SharedObjects'

// Frontend-only draft marker for an intentionally empty select value.
export type EmptySelection = DisplayText

type MerchantIdentityDraft = {
  merchantName: PersonName
  storeName: DisplayText
  category: StoreCategory | EmptySelection
  storeAddress: AddressText
}

type MerchantScheduleDraft = {
  openTime: TimeOfDay
  closeTime: TimeOfDay
  avgPrepMinutes: Minutes
}

type MerchantAssetDraft = {
  imageUrl: ImageUrl
  uploadedImageName: DisplayText
  note: NoteText
}

export type MerchantDraft = MerchantIdentityDraft & MerchantScheduleDraft & MerchantAssetDraft
