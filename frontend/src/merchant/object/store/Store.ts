import type {
  CuisineLabel,
  CurrencyCents,
  DisplayText,
  EntityCount,
  ImageUrl,
  Minutes,
  PersonName,
  RatingValue,
  StoreId,
  StoreCategory,
} from '@/shared/object/domain/DomainObjects'
import type { StoreStatus } from '@/shared/object/domain/DomainTypes'
import type { MenuItem } from '@/merchant/object/menu/MenuItem'
import type { BusinessHours } from '@/merchant/object/store/BusinessHours'

export type StoreIdentity = {
  id: StoreId
  merchantName: PersonName
  name: DisplayText
  category: StoreCategory
  cuisine: CuisineLabel
}

export type StoreOperations = {
  status: StoreStatus
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
  imageUrl?: ImageUrl
  menu: MenuItem[]
}

export type StoreMetrics = {
  averageRating: RatingValue
  ratingCount: EntityCount
  oneStarRatingCount: EntityCount
  revenueCents: CurrencyCents
}

export type Store = StoreIdentity & {
  operations: StoreOperations
  metrics: StoreMetrics
} & StoreOperations & StoreMetrics
