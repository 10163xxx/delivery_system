import { useEffect } from 'react'
import {
  PAYOUT_ACCOUNT_TYPE,
  ROLE,
  ROUTE_PATH,
  type Customer,
  type MenuItem,
  type MerchantProfile,
  type OrderSummary,
  type Store,
} from '@/shared/object'
import {
  CUSTOMER_STORE_SEARCH_HISTORY_KEY,
  MAX_CUSTOMER_STORE_SEARCH_HISTORY,
  canReviewOrder,
  getInitialQuantities,
} from '@/shared/delivery'
import type {
  MerchantApplicationView,
  MerchantWorkspaceView,
} from '@/shared/delivery-app/object'
import type { useDeliveryConsolePageState } from './page-state-service'
import type { SessionState } from './page-view-service.types'

type EffectsArgs = {
  locationPathname: string
  navigate: (to: string, options?: { replace?: boolean }) => void
  searchParams: URLSearchParams
  sessionService: SessionState
  pageState: ReturnType<typeof useDeliveryConsolePageState>
  customerWorkspaceView: string
  merchantWorkspaceView: MerchantWorkspaceView
  merchantWorkspaceViewFromUrl: MerchantWorkspaceView
  merchantApplicationViewFromUrl: MerchantApplicationView
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
  quantities: Record<string, number>
  selectedCouponId: string
}

export function useDeliveryConsolePageViewEffects(args: EffectsArgs) {
  const {
    locationPathname,
    navigate,
    searchParams,
    sessionService,
    pageState,
    customerWorkspaceView,
    merchantWorkspaceView,
    merchantWorkspaceViewFromUrl,
    merchantApplicationViewFromUrl,
    activeCustomerOrder,
    activeReviewOrder,
    selectedCustomer,
    selectedStore,
    selectedStoreCategory,
    selectedStoreId,
    selectedMerchantStoreId,
    merchantStores,
    selectedRiderId,
    merchantProfile,
    quantities,
    selectedCouponId,
  } = args
  const { session, state, setCustomerStoreSearchHistory } = sessionService
  const {
    setSelectedCustomerId,
    setSelectedStoreCategory,
    setSelectedStoreId,
    setSelectedMerchantStoreId,
    setSelectedRiderId,
    setMerchantWorkspaceState,
    setMerchantApplicationState,
    setDeliveryAddress,
    setDeliveryAddressError,
    setQuantities,
    setCustomerNameDraft,
    setMerchantProfileDraft,
    setMerchantDraft,
    setMerchantProfileFormErrors,
    customerStoreSearch,
    setSelectedCouponId,
    lastCustomerDraftSyncIdRef,
    lastMerchantProfileDraftSyncIdRef,
  } = pageState

  useEffect(() => {
    setMerchantWorkspaceState(merchantWorkspaceViewFromUrl)
  }, [merchantWorkspaceViewFromUrl, setMerchantWorkspaceState])

  useEffect(() => {
    setMerchantApplicationState(merchantApplicationViewFromUrl)
  }, [merchantApplicationViewFromUrl, setMerchantApplicationState])

  useEffect(() => {
    if (!state || !session) return

    if (session.user.role === ROLE.customer && session.user.linkedProfileId) {
      const customer = state.customers.find((entry: Customer) => entry.id === session.user.linkedProfileId)
      if (customer) {
        setSelectedCustomerId(customer.id)
        setDeliveryAddress(customer.defaultAddress)
        setDeliveryAddressError(null)
      }
    } else if (!pageState.selectedCustomerId && state.customers.length > 0) {
      const customer = state.customers[0]
      if (customer) {
        setSelectedCustomerId(customer.id)
        setDeliveryAddress(customer.defaultAddress)
        setDeliveryAddressError(null)
      }
    }

    if (session.user.role === ROLE.merchant) {
      setMerchantDraft((current) => ({
        ...current,
        merchantName: session.user.displayName,
      }))
    }

    if (session.user.role !== ROLE.customer && !selectedStoreId && state.stores.length > 0) {
      const store = state.stores[0]
      if (store) {
        setSelectedStoreId(store.id)
        setQuantities(getInitialQuantities(store))
      }
    }

    if (session.user.role === ROLE.rider && session.user.linkedProfileId) {
      setSelectedRiderId(session.user.linkedProfileId)
    } else if (!selectedRiderId && state.riders.length > 0) {
      const rider = state.riders[0]
      if (rider) {
        setSelectedRiderId(rider.id)
      }
    }
  }, [
    pageState,
    selectedRiderId,
    selectedStoreId,
    session,
    setDeliveryAddress,
    setDeliveryAddressError,
    setMerchantDraft,
    setQuantities,
    setSelectedCustomerId,
    setSelectedRiderId,
    setSelectedStoreId,
    state,
  ])

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

    if (locationPathname.startsWith('/customer/') || locationPathname.startsWith('/merchant/')) {
      navigate(ROUTE_PATH.root, { replace: true })
    }
  }, [locationPathname, navigate, session])

  useEffect(() => {
    if (!state || !session || session.user.role !== ROLE.customer) return
    if (locationPathname !== ROUTE_PATH.customerOrder) return

    const storeIdFromUrl = searchParams.get('store') ?? ''
    const store = state.stores.find((entry: Store) => entry.id === storeIdFromUrl)
    const nextStoreId = store?.id ?? ''

    if (nextStoreId === selectedStoreId) {
      if (store?.category && store.category !== selectedStoreCategory) {
        setSelectedStoreCategory(store.category)
      }
      return
    }

    setSelectedStoreId(nextStoreId)
    setSelectedStoreCategory(store?.category ?? '')
    setQuantities(getInitialQuantities(store))
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

  useEffect(() => {
    if (!session || session.user.role !== ROLE.merchant) return
    if (!selectedMerchantStoreId) return
    if (merchantWorkspaceView !== 'console') {
      setSelectedMerchantStoreId('')
      return
    }
    if (merchantStores.some((store: Store) => store.id === selectedMerchantStoreId)) return
    setSelectedMerchantStoreId('')
  }, [merchantStores, merchantWorkspaceView, selectedMerchantStoreId, session, setSelectedMerchantStoreId])

  useEffect(() => {
    if (!selectedCustomer) return
    if (lastCustomerDraftSyncIdRef.current === selectedCustomer.id) return
    lastCustomerDraftSyncIdRef.current = selectedCustomer.id
    setCustomerNameDraft(selectedCustomer.name)
  }, [lastCustomerDraftSyncIdRef, selectedCustomer, setCustomerNameDraft])

  useEffect(() => {
    if (!merchantProfile) return
    if (lastMerchantProfileDraftSyncIdRef.current === merchantProfile.id) return
    lastMerchantProfileDraftSyncIdRef.current = merchantProfile.id
    setMerchantProfileDraft({
      contactPhone: merchantProfile.contactPhone,
      payoutAccountType: merchantProfile.payoutAccount?.accountType ?? PAYOUT_ACCOUNT_TYPE.alipay,
      bankName: merchantProfile.payoutAccount?.bankName ?? '',
      accountNumber: merchantProfile.payoutAccount?.accountNumber ?? '',
      accountHolder: merchantProfile.payoutAccount?.accountHolder ?? '',
    })
    setMerchantProfileFormErrors({})
  }, [
    lastMerchantProfileDraftSyncIdRef,
    merchantProfile,
    setMerchantProfileDraft,
    setMerchantProfileFormErrors,
  ])

  useEffect(() => {
    const keyword = customerStoreSearch.trim()
    if (!keyword) return

    setCustomerStoreSearchHistory((current) => {
      const normalized = keyword.toLowerCase()
      const next = [
        keyword,
        ...current.filter((entry: string) => entry.toLowerCase() !== normalized),
      ].slice(0, MAX_CUSTOMER_STORE_SEARCH_HISTORY)
      window.localStorage.setItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [customerStoreSearch, setCustomerStoreSearchHistory])

  useEffect(() => {
    if (customerWorkspaceView !== 'review') return
    if (activeReviewOrder && canReviewOrder(activeReviewOrder)) return
    navigate(ROUTE_PATH.customerOrders, { replace: true })
  }, [activeReviewOrder, customerWorkspaceView, navigate])

  useEffect(() => {
    if (customerWorkspaceView !== 'order-detail') return
    if (activeCustomerOrder) return
    navigate(ROUTE_PATH.customerOrders, { replace: true })
  }, [activeCustomerOrder, customerWorkspaceView, navigate])

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
      (coupon) => coupon.id === selectedCouponId && nextCartSubtotal >= coupon.minimumSpendCents,
    )
    if (!couponStillUsable && selectedCouponId) {
      setSelectedCouponId('')
    }
  }, [quantities, selectedCouponId, selectedCustomer, selectedStore, setSelectedCouponId])
}
