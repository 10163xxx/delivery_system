import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { Store } from '@/objects/core/SharedObjects'
import type { StoreLocationStatus } from '@/pages/DeliveryConsole/functions/map/DeliveryStoreLocation'

export const CUSTOMER_STORE_TAB = {
  menu: 'menu',
  reviews: 'reviews',
} as const

export type CustomerStoreTab =
  (typeof CUSTOMER_STORE_TAB)[keyof typeof CUSTOMER_STORE_TAB]

export type StoreCustomerReview = CustomerRoleProps['storeCustomerReviews'][string][number]

type CustomerStoreBrowseCardBindings = Pick<
  CustomerRoleProps,
  | 'enterStore'
  | 'favoriteStoreIds'
  | 'formatAggregateRating'
  | 'formatPrice'
  | 'formatStoreAvailability'
  | 'formatTime'
  | 'isStoreCurrentlyOpen'
  | 'monthlyOrdersByStore'
  | 'selectedCustomer'
  | 'storeBrowseHighlights'
  | 'toggleBlockedStore'
  | 'toggleFavoriteStore'
>

export type RecentFrequentStore = CustomerRoleProps['recentFrequentStores'][number]

export type CustomerStoreBrowseResultCardProps = {
  store: Store
  reviews: StoreCustomerReview[]
  props: CustomerStoreBrowseCardBindings & {
    storeLocationStatus?: StoreLocationStatus
  }
}
