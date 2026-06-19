// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
