import type {
  AccountHolderName,
  AccountNumber,
  BankName,
  CurrencyCents,
  CuisineLabel,
  DescriptionText,
  DisplayText,
  EntityCount,
  ImageUrl,
  IsoDateTime,
  MerchantApplicationId,
  MerchantApplicationStatus,
  MerchantId,
  Minutes,
  NoteText,
  PersonName,
  PhoneNumber,
  RatingValue,
  StoreCategory,
  StoreId,
  TimeOfDay,
  MenuItemId,
  Quantity,
  ExternalUrl,
} from '@/shared/object/domain'

export type OperationalSchedule = {
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
}

export type MerchantIdentity = {
  merchantName: PersonName
}

export type MerchantIncomeSummary = {
  withdrawnCents: CurrencyCents
  availableToWithdrawCents: CurrencyCents
  withdrawalHistory: MerchantWithdrawal[]
}

export type MenuItem = {
  id: MenuItemId
  name: DisplayText
  description: DescriptionText
  priceCents: CurrencyCents
  imageUrl?: ImageUrl
  remainingQuantity?: Quantity
}

export type BusinessHours = {
  openTime: TimeOfDay
  closeTime: TimeOfDay
}

export type Store = {
  id: StoreId
} & MerchantIdentity & {
  name: DisplayText
  category: StoreCategory
  cuisine: CuisineLabel
  status: 'Open' | 'Busy' | 'Revoked'
} & OperationalSchedule & {
  imageUrl?: ImageUrl
  menu: MenuItem[]
  averageRating: RatingValue
  ratingCount: EntityCount
  oneStarRatingCount: EntityCount
  revenueCents: CurrencyCents
}

export type MerchantWithdrawal = {
  id: ExternalUrl
  amountCents: CurrencyCents
  accountLabel: DisplayText
  requestedAt: IsoDateTime
}

export type MerchantPayoutAccountType = 'alipay' | 'bank'

export type MerchantPayoutAccount = {
  accountType: MerchantPayoutAccountType
  bankName?: BankName
  accountNumber: AccountNumber
  accountHolder: AccountHolderName
}

export type MerchantProfile = {
  id: MerchantId
} & MerchantIdentity & {
  contactPhone: PhoneNumber
  payoutAccount?: MerchantPayoutAccount
  settledIncomeCents: CurrencyCents
} & MerchantIncomeSummary

export type MerchantApplication = {
  id: MerchantApplicationId
} & MerchantIdentity & {
  storeName: DisplayText
  category: StoreCategory
} & OperationalSchedule & {
  imageUrl?: ImageUrl
  note?: NoteText
  status: MerchantApplicationStatus
  reviewNote?: NoteText
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}

export type UpdateMerchantProfileRequest = {
  contactPhone: PhoneNumber
  payoutAccount: MerchantPayoutAccount
}

export type WithdrawMerchantIncomeRequest = {
  amountCents: CurrencyCents
}

export type MerchantRegistrationRequest = {
} & MerchantIdentity & {
  storeName: DisplayText
  category: StoreCategory
} & OperationalSchedule & {
  imageUrl?: ImageUrl
  note?: NoteText
}

export type AddMenuItemRequest = {
  name: DisplayText
  description: DescriptionText
  priceCents: CurrencyCents
  imageUrl?: ImageUrl
  remainingQuantity?: Quantity
}

export type UpdateMenuItemStockRequest = {
  remainingQuantity?: Quantity
}

export type UpdateMenuItemPriceRequest = {
  priceCents: CurrencyCents
}

export type UpdateStoreOperationalRequest = OperationalSchedule

export type ReviewMerchantApplicationRequest = {
  reviewNote: NoteText
}

export type ImageUploadResponse = {
  url: ImageUrl
}
