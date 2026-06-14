import type { Dispatch, SetStateAction } from 'react'
import type {
  CustomerId,
  DisplayText,
  StoreId,
} from '@/objects/core/SharedObjects'

export type CustomerSearchState = {
  activeCustomerId: CustomerId | ''
  customerStoreSearchDraft: DisplayText
  favoriteStoreIds: StoreId[]
  blockedStoreIds: StoreId[]
  setCustomerStoreSearchDraft: Dispatch<SetStateAction<DisplayText>>
  setCustomerStoreSearch: Dispatch<SetStateAction<DisplayText>>
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
  setFavoriteStoreIds: Dispatch<SetStateAction<StoreId[]>>
  setBlockedStoreIds: Dispatch<SetStateAction<StoreId[]>>
}
