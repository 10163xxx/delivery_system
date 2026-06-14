import type {
  CuisineLabel,
  DisplayText,
  PersonName,
  StoreId,
} from '@/objects/core/SharedObjects'

export type StoreIdentity = {
  id: StoreId
  merchantName: PersonName
  name: DisplayText
  category: DisplayText
  cuisine: CuisineLabel
}
