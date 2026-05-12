import type { Dispatch, SetStateAction } from 'react'
import type { useDeliveryConsolePageState } from '@/shared/app/delivery/DeliveryPageStateService'
import type {
  CustomerWorkspaceView,
  MerchantApplicationView,
  MerchantWorkspaceView,
} from '@/shared/object/core/DeliveryAppObjects'
import type { AuthSession, DeliveryAppState, Customer, MerchantProfile, OrderSummary, Store } from '@/shared/object/core/SharedObjects'

export type DeliveryPageState = ReturnType<typeof useDeliveryConsolePageState>

export type SessionState = {
  session: AuthSession | null
  state: DeliveryAppState | null
  setError: Dispatch<SetStateAction<string | null>>
  customerStoreSearchHistory: string[]
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
}

export type CustomerProfileNoticeId = string

export type DeliveryPageViewParams = {
  locationPathname: string
  navigate: (to: string, options?: { replace?: boolean }) => void
  routeOrderId?: string
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
  selectedStoreId: string
  selectedMerchantStoreId: string
  merchantStores: Store[]
  selectedRiderId: string
  merchantProfile: MerchantProfile | undefined
}

type DeliveryPageViewEffectsDraftArgs = {
  quantities: Record<string, number>
  selectedCouponId: string
  customerProfileNoticeIds: CustomerProfileNoticeId[]
}

export type DeliveryPageViewEffectsArgs = DeliveryPageViewEffectsRouteArgs &
  DeliveryPageViewEffectsStateArgs &
  DeliveryPageViewEffectsSelectionArgs &
  DeliveryPageViewEffectsDraftArgs

type DeliveryPageViewDerivedRouteArgs = {
  routeOrderId?: string
  sessionService: SessionState
}

type DeliveryPageViewDerivedSelectionArgs = {
  selectedCustomerId: string
  selectedStoreCategory: string
  selectedStoreId: string
  selectedMerchantStoreId: string
  selectedRiderId: string
  customerStoreSearch: string
  merchantWorkspaceView: MerchantWorkspaceView
}

export type DeliveryPageViewDerivedArgs = DeliveryPageViewDerivedRouteArgs &
  DeliveryPageViewDerivedSelectionArgs

export type DeliveryPageDerivedState = DeliveryAppState | null
