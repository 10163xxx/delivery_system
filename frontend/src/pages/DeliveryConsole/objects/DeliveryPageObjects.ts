import type { Dispatch, SetStateAction } from 'react'
import type { useDeliveryConsolePageState } from '@/pages/DeliveryConsole/hooks/DeliveryConsolePageState'
import type { CustomerWorkspaceView } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type { MerchantApplicationView, MerchantWorkspaceView } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import type {
  AuthSession,
  CouponId,
  Customer,
  CustomerId,
  DeliveryAppState,
  DisplayText,
  MenuItemId,
  MerchantProfile,
  OrderId,
  OrderSummary,
  RiderId,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'

export type DeliveryPageState = ReturnType<typeof useDeliveryConsolePageState>

export type SessionState = {
  session: AuthSession | null
  state: DeliveryAppState | null
  setError: Dispatch<SetStateAction<DisplayText | null>>
  customerStoreSearchHistory: string[]
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
  favoriteStoreIds: StoreId[]
  setFavoriteStoreIds: Dispatch<SetStateAction<StoreId[]>>
  blockedStoreIds: StoreId[]
  setBlockedStoreIds: Dispatch<SetStateAction<StoreId[]>>
}

export type CustomerProfileNoticeId = string

export type DeliveryPageViewParams = {
  locationPathname: string
  navigate: (to: string, options?: { replace?: boolean }) => void
  routeOrderId?: OrderId
  searchParams: URLSearchParams
  setSearchParams: (nextInit: URLSearchParams | Record<string, string>) => void
  sessionService: SessionState
  pageState: DeliveryPageState
}

type DeliveryPageViewEffectsRouteArgs = {
  locationPathname: string
  navigate: (to: string, options?: { replace?: boolean }) => void
  searchParams: URLSearchParams
}

type DeliveryPageViewEffectsStateArgs = {
  sessionService: SessionState
  pageState: DeliveryPageState
  customerWorkspaceView: CustomerWorkspaceView
  merchantWorkspaceView: MerchantWorkspaceView
  merchantWorkspaceViewFromUrl: MerchantWorkspaceView
  merchantApplicationViewFromUrl: MerchantApplicationView
}

type DeliveryPageViewEffectsSelectionArgs = {
  activeCustomerOrder: OrderSummary | null
  activeReviewOrder: OrderSummary | null
  selectedCustomer: Customer | undefined
  selectedStore: Store | undefined
  selectedStoreCategory: DisplayText
  selectedStoreId: StoreId | ''
  selectedMerchantStoreId: StoreId | ''
  merchantStores: Store[]
  selectedRiderId: RiderId | ''
  merchantProfile: MerchantProfile | undefined
}

type DeliveryPageViewEffectsDraftArgs = {
  quantities: Record<MenuItemId, number>
  selectedMenuItemConfigurations: Record<MenuItemId, import('@/pages/DeliveryConsole/objects/DeliveryDraftObjects').SelectedMenuItemConfiguration>
  selectedCouponId: CouponId | ''
  customerProfileNoticeIds: CustomerProfileNoticeId[]
}

export type DeliveryPageViewEffectsArgs = DeliveryPageViewEffectsRouteArgs &
  DeliveryPageViewEffectsStateArgs &
  DeliveryPageViewEffectsSelectionArgs &
  DeliveryPageViewEffectsDraftArgs

type DeliveryPageViewDerivedRouteArgs = {
  routeOrderId?: OrderId
  sessionService: SessionState
}

type DeliveryPageViewDerivedSelectionArgs = {
  selectedCustomerId: CustomerId | ''
  selectedStoreCategory: string
  selectedStoreId: StoreId | ''
  selectedMerchantStoreId: StoreId | ''
  selectedRiderId: RiderId | ''
  customerStoreSearch: DisplayText
  favoriteStoreIds: StoreId[]
  blockedStoreIds: StoreId[]
  merchantWorkspaceView: MerchantWorkspaceView
}

export type DeliveryPageViewDerivedArgs = DeliveryPageViewDerivedRouteArgs &
  DeliveryPageViewDerivedSelectionArgs

export type DeliveryPageDerivedState = DeliveryAppState | null
