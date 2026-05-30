import type {
  AddressText,
  CuisineLabel,
  CurrencyCents,
  DisplayText,
  EntityCount,
  ImageUrl,
  Minutes,
  PersonName,
  AverageRating,
  StoreId,
} from '@/objects/domain/DomainObjects'
import type { MenuItem } from '@/objects/merchant/menu/MenuItem'
import type { BusinessHours } from '@/objects/merchant/store/BusinessHours'

export type StoreIdentity = {
  id: StoreId
  merchantName: PersonName
  name: DisplayText
  category: DisplayText
  cuisine: CuisineLabel
}

export type StoreOperations = {
  status: DisplayText
  storeAddress: AddressText
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
  imageUrl?: ImageUrl
  menu: MenuItem[]
}

export type StoreMetrics = {
  averageRating: AverageRating
  ratingCount: EntityCount
  oneStarRatingCount: EntityCount
  revenueCents: CurrencyCents
}

export type Store = StoreIdentity & {
  operations: StoreOperations
  metrics: StoreMetrics
} & StoreOperations & StoreMetrics
