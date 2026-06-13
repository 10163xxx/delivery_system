import { useEffect } from 'react'
import {
  clearSeenCustomerProfileNoticeIds,
  saveSeenCustomerProfileNoticeIds,
} from '@/system/api/SharedApi'
import {
  ROLE,
  ROUTE_PATH,
  ROUTE_QUERY_KEY,
  type Customer,
  type DisplayText,
  type OrderSummary,
  type Store,
  type StoreId,
} from '@/objects/core/SharedObjects'
import { canReviewOrder } from '@/pages/DeliveryConsole/functions/review/DeliveryReview'
import { getCartSubtotalCents } from '@/pages/DeliveryConsole/functions/cart/DeliveryMenuPricing'
import { getSelectedCartLines } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type {
  DeliveryPageState,
  DeliveryPageViewEffectsArgs,
  SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import {
  appendCustomerStoreSearchHistory,
  readCustomerBlockedStoreIds,
  readCustomerFavoriteStoreIds,
  readSeenCustomerProfileNoticeIds,
  syncSelectedStoreFromRoute,
} from '@/pages/DeliveryConsole/functions/storage/DeliveryEffectStorage'
import {
  buildCustomerOrderStoreRoute,
  CUSTOMER_WORKSPACE_VIEW,
  isCustomerProfileWorkspaceView,
  type CustomerWorkspaceView,
} from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'

export function useCustomerProfileNoticeStorageEffects(
  session: SessionState['session'],
  seenCustomerProfileNoticeIds: string[],
  setSeenCustomerProfileNoticeIds: DeliveryPageState['notices']['setSeenCustomerProfileNoticeIds'],
) {
  useEffect(() => {
    if (!session || session.user.role !== ROLE.customer) {
      setSeenCustomerProfileNoticeIds([])
      return
    }

    try {
      setSeenCustomerProfileNoticeIds(readSeenCustomerProfileNoticeIds(session.user.id))
    } catch {
      clearSeenCustomerProfileNoticeIds(session.user.id)
      setSeenCustomerProfileNoticeIds([])
    }
  }, [session, setSeenCustomerProfileNoticeIds])

  useEffect(() => {
    if (!session || session.user.role !== ROLE.customer) return
    saveSeenCustomerProfileNoticeIds(session.user.id, seenCustomerProfileNoticeIds)
  }, [seenCustomerProfileNoticeIds, session])
}

export function useCustomerStoreRouteSyncEffect(args: {
  state: SessionState['state']
  session: SessionState['session']
  blockedStoreIds: StoreId[]
  locationPathname: string
  searchParams: URLSearchParams
  selectedStoreCategory: DisplayText
  selectedStoreId: StoreId | ''
  setQuantities: DeliveryPageState['checkout']['setQuantities']
  setSelectedStoreCategory: DeliveryPageState['setSelectedStoreCategory']
  setSelectedStoreId: DeliveryPageState['setSelectedStoreId']
}) {
  const {
    state,
    session,
    blockedStoreIds,
    locationPathname,
    searchParams,
    selectedStoreCategory,
    selectedStoreId,
    setQuantities,
    setSelectedStoreCategory,
    setSelectedStoreId,
  } = args

  useEffect(() => {
    if (!state || !session || session.user.role !== ROLE.customer) return
    if (
      locationPathname !== ROUTE_PATH.customerOrder &&
      locationPathname !== ROUTE_PATH.customerCart
    ) return
    syncSelectedStoreFromRoute({
      blockedStoreIds,
      searchParams,
      selectedStoreCategory,
      selectedStoreId,
      setQuantities,
      setSelectedStoreCategory,
      setSelectedStoreId,
      state,
    })
  }, [
    locationPathname,
    searchParams,
    blockedStoreIds,
    selectedStoreCategory,
    selectedStoreId,
    session,
    setQuantities,
    setSelectedStoreCategory,
    setSelectedStoreId,
    state,
  ])
}

export function useCustomerDraftSyncEffect(
  selectedCustomer: Customer | undefined,
  lastCustomerDraftSyncIdRef: DeliveryPageState['lastCustomerDraftSyncIdRef'],
  setCustomerNameDraft: DeliveryPageState['profile']['setCustomerNameDraft'],
) {
  useEffect(() => {
    if (!selectedCustomer) return
    if (lastCustomerDraftSyncIdRef.current === selectedCustomer.id) return
    lastCustomerDraftSyncIdRef.current = selectedCustomer.id
    setCustomerNameDraft(selectedCustomer.name)
  }, [lastCustomerDraftSyncIdRef, selectedCustomer, setCustomerNameDraft])
}

export function useCustomerStorePreferenceStorageEffects(args: {
  selectedCustomer: Customer | undefined
  setFavoriteStoreIds: SessionState['setFavoriteStoreIds']
  setBlockedStoreIds: SessionState['setBlockedStoreIds']
}) {
  const { selectedCustomer, setFavoriteStoreIds, setBlockedStoreIds } = args

  useEffect(() => {
    if (!selectedCustomer) {
      setFavoriteStoreIds([])
      setBlockedStoreIds([])
      return
    }

    setFavoriteStoreIds(readCustomerFavoriteStoreIds(selectedCustomer.id).map((id) => asDomainText<StoreId>(id)))
    setBlockedStoreIds(readCustomerBlockedStoreIds(selectedCustomer.id).map((id) => asDomainText<StoreId>(id)))
  }, [selectedCustomer, setBlockedStoreIds, setFavoriteStoreIds])
}

export function useCustomerNoticeMarkSeenEffect(
  session: SessionState['session'],
  customerWorkspaceView: CustomerWorkspaceView,
  customerProfileNoticeIds: string[],
  setSeenCustomerProfileNoticeIds: DeliveryPageState['notices']['setSeenCustomerProfileNoticeIds'],
) {
  useEffect(() => {
    if (!session || session.user.role !== ROLE.customer) return
    if (!isCustomerProfileWorkspaceView(customerWorkspaceView)) return
    if (customerProfileNoticeIds.length === 0) return

    setSeenCustomerProfileNoticeIds((current) => {
      const nextNoticeIds = customerProfileNoticeIds.filter((noticeId) => !current.includes(noticeId))
      if (nextNoticeIds.length === 0) return current
      return [...current, ...nextNoticeIds]
    })
  }, [customerProfileNoticeIds, customerWorkspaceView, session, setSeenCustomerProfileNoticeIds])
}

export function useCustomerSearchHistoryEffect(
  customerStoreSearch: string,
  setCustomerStoreSearchHistory: SessionState['setCustomerStoreSearchHistory'],
) {
  useEffect(() => {
    const keyword = customerStoreSearch.trim()
    if (!keyword) return
    setCustomerStoreSearchHistory((current) => appendCustomerStoreSearchHistory(keyword, current))
  }, [customerStoreSearch, setCustomerStoreSearchHistory])
}

export function useCustomerWorkspaceNavigationGuards(args: {
  customerWorkspaceView: CustomerWorkspaceView
  activeReviewOrder: OrderSummary | null
  activeCustomerOrder: OrderSummary | null
  searchParams: URLSearchParams
  selectedStore: Store | undefined
  quantities: Record<string, number>
  selectedMenuItemConfigurations: Record<string, import('@/pages/DeliveryConsole/objects/DeliveryDraftObjects').SelectedMenuItemConfiguration>
  navigate: DeliveryPageViewEffectsArgs['navigate']
}) {
  const {
    customerWorkspaceView,
    activeReviewOrder,
    activeCustomerOrder,
    searchParams,
    selectedStore,
    quantities,
    selectedMenuItemConfigurations,
    navigate,
  } = args

  useEffect(() => {
    if (customerWorkspaceView !== CUSTOMER_WORKSPACE_VIEW.review) return
    if (activeReviewOrder && canReviewOrder(activeReviewOrder)) return
    navigate(ROUTE_PATH.customerOrders, { replace: true })
  }, [activeReviewOrder, customerWorkspaceView, navigate])

  useEffect(() => {
    if (customerWorkspaceView !== CUSTOMER_WORKSPACE_VIEW.orderDetail) return
    if (activeCustomerOrder) return
    navigate(ROUTE_PATH.customerOrders, { replace: true })
  }, [activeCustomerOrder, customerWorkspaceView, navigate])

  useEffect(() => {
    if (customerWorkspaceView !== CUSTOMER_WORKSPACE_VIEW.cart) return
    const storeIdFromRoute = searchParams.get(ROUTE_QUERY_KEY.store) ?? ''
    if (!selectedStore) {
      if (!storeIdFromRoute) navigate(ROUTE_PATH.customerOrder, { replace: true })
      return
    }

    const hasSelectedItems = getSelectedCartLines(selectedStore, quantities, selectedMenuItemConfigurations).length > 0
    if (hasSelectedItems) return
    navigate(buildCustomerOrderStoreRoute(selectedStore.id), { replace: true })
  }, [customerWorkspaceView, navigate, quantities, searchParams, selectedMenuItemConfigurations, selectedStore])
}

export function useCheckoutCouponValidationEffect(args: {
  selectedStore: Store | undefined
  quantities: Record<string, number>
  selectedMenuItemConfigurations: Record<string, import('@/pages/DeliveryConsole/objects/DeliveryDraftObjects').SelectedMenuItemConfiguration>
  selectedCustomer: Customer | undefined
  selectedCouponId: string
  setSelectedCouponId: DeliveryPageState['checkout']['setSelectedCouponId']
}) {
  const {
    selectedStore,
    quantities,
    selectedMenuItemConfigurations,
    selectedCustomer,
    selectedCouponId,
    setSelectedCouponId,
  } = args

  useEffect(() => {
    const nextCartSubtotal = getCartSubtotalCents(selectedStore, quantities, selectedMenuItemConfigurations)

    if (!selectedCustomer || nextCartSubtotal <= 0) {
      if (selectedCouponId) setSelectedCouponId('')
      return
    }

    const couponStillUsable = selectedCustomer.coupons.some(
      (coupon) => coupon.id === selectedCouponId && nextCartSubtotal >= coupon.minimumSpendCents,
    )
    if (!couponStillUsable && selectedCouponId) setSelectedCouponId('')
  }, [quantities, selectedCouponId, selectedCustomer, selectedMenuItemConfigurations, selectedStore, setSelectedCouponId])
}
