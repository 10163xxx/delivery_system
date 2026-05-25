import type { Dispatch, SetStateAction } from 'react'
import type { useDeliveryConsolePageState } from '@/shared/app/delivery/DeliveryPageStateService'
import type {
  CustomerWorkspaceView,
  MerchantApplicationView,
  MerchantWorkspaceView,
} from '@/shared/object/core/DeliveryAppObjects'
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
} from '@/shared/object/core/SharedObjects'

export type DeliveryPageState = ReturnType<typeof useDeliveryConsolePageState>

export type SessionState = {
  session: AuthSession | null
  state: DeliveryAppState | null
  setError: Dispatch<SetStateAction<DisplayText | null>>
  customerStoreSearchHistory: string[]
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
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
  selectedStoreCategory: string
  selectedStoreId: StoreId | ''
  selectedMerchantStoreId: StoreId | ''
  merchantStores: Store[]
  selectedRiderId: RiderId | ''
  merchantProfile: MerchantProfile | undefined
}

type DeliveryPageViewEffectsDraftArgs = {
  quantities: Record<MenuItemId, number>
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
  merchantWorkspaceView: MerchantWorkspaceView
}

export type DeliveryPageViewDerivedArgs = DeliveryPageViewDerivedRouteArgs &
  DeliveryPageViewDerivedSelectionArgs

export type DeliveryPageDerivedState = DeliveryAppState | null
