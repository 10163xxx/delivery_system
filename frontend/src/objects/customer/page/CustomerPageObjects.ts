import type { NavigateFunction } from 'react-router-dom'
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import type { CustomerWorkspaceView } from '@/objects/page/DeliveryAppObjects'
import { REVIEW_TARGET } from '@/objects/core/SharedObjects'
import type { OrderSummary, Store } from '@/objects/core/SharedObjects'

export const CUSTOMER_ORDER_SECTION = {
  all: 'all',
  active: 'active',
  review: 'review',
  none: '',
} as const

export const CUSTOMER_STORE_TAB = {
  menu: 'menu',
  reviews: 'reviews',
} as const

export type CustomerOrderSection =
  (typeof CUSTOMER_ORDER_SECTION)[keyof typeof CUSTOMER_ORDER_SECTION]

export type CustomerStoreTab =
  (typeof CUSTOMER_STORE_TAB)[keyof typeof CUSTOMER_STORE_TAB]

export type CustomerRolePanelProps = {
  props: CustomerRoleProps
}

export type CustomerWorkspaceHeaderProps = {
  customerWorkspaceView: CustomerWorkspaceView
  customerProfileNoticeCount: number
  navigate: NavigateFunction
}

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
  props: CustomerStoreBrowseCardBindings
}

export type CheckoutPanelProps = Pick<
  CustomerRoleProps,
  | 'availableCheckoutCoupons'
  | 'cartSubtotal'
  | 'couponDiscountCents'
  | 'customerRequiresDefaultAddressUpdate'
  | 'deliveryFeeCents'
  | 'deliveryAddress'
  | 'deliveryAddressError'
  | 'formatPrice'
  | 'isCheckoutExpanded'
  | 'monthlySalesByMenuItem'
  | 'menuItemConfigurationModal'
  | 'openCheckout'
  | 'openMenuItemConfiguration'
  | 'openRechargePage'
  | 'payableTotalCents'
  | 'quantities'
  | 'remainingBalanceAfterCheckout'
  | 'remark'
  | 'scheduledDeliveryError'
  | 'scheduledDeliveryTime'
  | 'selectedCoupon'
  | 'selectedCouponId'
  | 'selectedCustomer'
  | 'selectedMenuItemConfigurations'
  | 'selectedStore'
  | 'selectedStoreCanOrder'
  | 'selectedStoreHasMenu'
  | 'closeMenuItemConfiguration'
  | 'confirmMenuItemConfiguration'
  | 'setDeliveryAddress'
  | 'setDeliveryAddressError'
  | 'setError'
  | 'setIsCheckoutExpanded'
  | 'setRemark'
  | 'setScheduledDeliveryError'
  | 'setScheduledDeliveryTime'
  | 'setScheduledDeliveryTouched'
  | 'setSelectedCouponId'
  | 'submitOrder'
  | 'suggestedDeliveryTime'
  | 'todayDeliveryCutoff'
  | 'updateQuantity'
  | 'isStoreCurrentlyOpen'
  | 'selectedStoreDeliveryDistanceLabel'
  | 'selectedStoreDistanceCategory'
  | 'selectedStoreIsDeliverable'
>

export type CustomerOrderSectionData = {
  title: string
  count: number
  orders: OrderSummary[]
  emptyText: string
}

type CustomerReviewSectionCopy = {
  title: string
  subtitle: string
  actionHint: string
  emptyHint: string
  extraNotePlaceholder: string
  buttonReadyLabel: string
  buttonIdleLabel: string
}

type CustomerReviewSectionState = {
  order: OrderSummary
  reasonOptions: string[]
  reviewErrorKey: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider
  reviewTarget: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider
}

type CustomerReviewSectionBindings = Pick<
  CustomerRoleProps,
  'reviewDrafts' | 'reviewErrors' | 'submitReview' | 'updateReviewDraft'
> & {
  hasPendingReview: CustomerRoleProps['hasPendingStoreReview']
}

export type CustomerReviewSectionProps = CustomerReviewSectionCopy &
  CustomerReviewSectionState & {
    props: CustomerReviewSectionBindings
  }

type CustomerReviewOrderContentBindings = Pick<
  CustomerRoleProps,
  | 'activeReviewOrder'
  | 'reviewDrafts'
  | 'reviewErrors'
  | 'submitReview'
  | 'updateReviewDraft'
  | 'STORE_REVIEW_REASON_OPTIONS'
  | 'RIDER_REVIEW_REASON_OPTIONS'
  | 'hasPendingStoreReview'
  | 'hasPendingRiderReview'
  | 'navigate'
  | 'REVIEW_WINDOW_DAYS'
>

export type CustomerReviewOrderContentProps = {
  props: CustomerReviewOrderContentBindings
}
