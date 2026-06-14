import type { CustomerActionParams } from '@/pages/CustomerConsole/objects/CustomerActionTypes'

export type CustomerSearchParams = Pick<
  CustomerActionParams,
  | 'activeCustomerId'
  | 'customerStoreSearchDraft'
  | 'favoriteStoreIds'
  | 'blockedStoreIds'
  | 'setCustomerStoreSearchDraft'
  | 'setCustomerStoreSearch'
  | 'setCustomerStoreSearchHistory'
  | 'setFavoriteStoreIds'
  | 'setBlockedStoreIds'
>
