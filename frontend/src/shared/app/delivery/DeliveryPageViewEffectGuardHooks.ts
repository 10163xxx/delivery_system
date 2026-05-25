import { useEffect } from 'react'
import {
  ROLE,
  ROUTE_PATH,
  ROUTE_QUERY_KEY,
  type Customer,
  type MenuItem,
  type OrderSummary,
  type Store,
} from '@/shared/object/core/SharedObjects'
import { canReviewOrder } from '@/shared/delivery/DeliveryServices'
import type {
  DeliveryPageState,
  DeliveryPageViewEffectsArgs,
  SessionState,
} from '@/shared/object/core/DeliveryPageObjects'
import {
  buildCustomerOrderStoreRoute,
  CUSTOMER_WORKSPACE_VIEW,
  type CustomerWorkspaceView,
  type MerchantWorkspaceView,
} from '@/shared/object/core/DeliveryAppObjects'
import {
  resetInvalidMerchantStoreSelection,
  syncSelectedStoreFromRoute,
} from './DeliveryEffectStorage'

export function useRoleRouteGuardEffect(
  session: SessionState['session'],
  locationPathname: string,
  navigate: DeliveryPageViewEffectsArgs['navigate'],
) {
  useEffect(() => {
    if (!session) return

    if (session.user.role === ROLE.customer) {
      if (
        locationPathname !== ROUTE_PATH.customerProfileAddresses &&
        !locationPathname.startsWith('/customer/')
      ) {
        navigate(ROUTE_PATH.customerOrder, { replace: true })
      }
      return
    }

    if (session.user.role === ROLE.merchant) {
      if (!locationPathname.startsWith('/merchant/')) {
        navigate(ROUTE_PATH.merchantApplicationSubmit, { replace: true })
      }
      return
    }

    if (
      locationPathname.startsWith('/customer/') ||
      locationPathname.startsWith('/merchant/')
    ) {
      navigate(ROUTE_PATH.root, { replace: true })
    }
  }, [locationPathname, navigate, session])
}

export function useCustomerStoreRouteSyncEffect(args: {
  state: SessionState['state']
  session: SessionState['session']
  locationPathname: string
  searchParams: URLSearchParams
  selectedStoreCategory: string
  selectedStoreId: string
  setQuantities: DeliveryPageState['setQuantities']
  setSelectedStoreCategory: DeliveryPageState['setSelectedStoreCategory']
  setSelectedStoreId: DeliveryPageState['setSelectedStoreId']
}) {
  const {
    state,
    session,
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
    selectedStoreCategory,
    selectedStoreId,
    session,
    setQuantities,
    setSelectedStoreCategory,
    setSelectedStoreId,
    state,
  ])
}

export function useMerchantSelectionGuardEffect(args: {
  session: SessionState['session']
  merchantStores: Store[]
  merchantWorkspaceView: MerchantWorkspaceView
  selectedMerchantStoreId: string
  setSelectedMerchantStoreId: DeliveryPageState['setSelectedMerchantStoreId']
}) {
  const {
    session,
    merchantStores,
    merchantWorkspaceView,
    selectedMerchantStoreId,
    setSelectedMerchantStoreId,
  } = args

  useEffect(() => {
    if (!session || session.user.role !== ROLE.merchant) return
    resetInvalidMerchantStoreSelection({
      merchantStores,
      merchantWorkspaceView,
      selectedMerchantStoreId,
      setSelectedMerchantStoreId,
    })
  }, [
    merchantStores,
    merchantWorkspaceView,
    selectedMerchantStoreId,
    session,
    setSelectedMerchantStoreId,
  ])
}

export function useCustomerWorkspaceNavigationGuards(args: {
  customerWorkspaceView: CustomerWorkspaceView
  activeReviewOrder: OrderSummary | null
  activeCustomerOrder: OrderSummary | null
  searchParams: URLSearchParams
  selectedStore: Store | undefined
  quantities: Record<string, number>
  navigate: DeliveryPageViewEffectsArgs['navigate']
}) {
  const {
    customerWorkspaceView,
    activeReviewOrder,
    activeCustomerOrder,
    searchParams,
    selectedStore,
    quantities,
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
      if (!storeIdFromRoute) {
        navigate(ROUTE_PATH.customerOrder, { replace: true })
      }
      return
    }

    const hasSelectedItems = selectedStore.menu.some(
      (item: MenuItem) => (quantities[item.id] ?? 0) > 0,
    )
    if (hasSelectedItems) return
    navigate(buildCustomerOrderStoreRoute(selectedStore.id), { replace: true })
  }, [customerWorkspaceView, navigate, quantities, searchParams, selectedStore])
}

export function useCheckoutCouponValidationEffect(args: {
  selectedStore: Store | undefined
  quantities: Record<string, number>
  selectedCustomer: Customer | undefined
  selectedCouponId: string
  setSelectedCouponId: DeliveryPageState['setSelectedCouponId']
}) {
  const {
    selectedStore,
    quantities,
    selectedCustomer,
    selectedCouponId,
    setSelectedCouponId,
  } = args

  useEffect(() => {
    const nextCartSubtotal = selectedStore
      ? selectedStore.menu.reduce(
          (sum: number, item: MenuItem) => sum + item.priceCents * (quantities[item.id] ?? 0),
          0,
        )
      : 0

    if (!selectedCustomer || nextCartSubtotal <= 0) {
      if (selectedCouponId) setSelectedCouponId('')
      return
    }

    const couponStillUsable = selectedCustomer.coupons.some(
      (coupon) =>
        coupon.id === selectedCouponId &&
        nextCartSubtotal >= coupon.minimumSpendCents,
    )
    if (!couponStillUsable && selectedCouponId) {
      setSelectedCouponId('')
    }
  }, [quantities, selectedCouponId, selectedCustomer, selectedStore, setSelectedCouponId])
}
