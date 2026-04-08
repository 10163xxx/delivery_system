import { useEffect } from 'react'
import type { Customer, MenuItem, MerchantProfile, OrderSummary, Store } from '@/domain'
import {
  CUSTOMER_STORE_SEARCH_HISTORY_KEY,
  MAX_CUSTOMER_STORE_SEARCH_HISTORY,
  canReviewOrder,
  getInitialQuantities,
} from '@/features/delivery-console'
import type { SessionState } from './page-view-service.types'

type EffectsArgs = {
  locationPathname: string
  navigate: (to: string, options?: { replace?: boolean }) => void
  searchParams: URLSearchParams
  sessionService: SessionState
  pageState: any
  customerWorkspaceView: string
  merchantWorkspaceView: string
  merchantWorkspaceViewFromUrl: string
  merchantApplicationViewFromUrl: string
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

    if (session.user.role === 'customer' && session.user.linkedProfileId) {
      const customer = state.customers.find((entry: Customer) => entry.id === session.user.linkedProfileId)
      if (customer) {
        setSelectedCustomerId(customer.id)
        setDeliveryAddress(customer.defaultAddress)
        setDeliveryAddressError(null)
      }
    } else if (!pageState.selectedCustomerId && state.customers.length > 0) {
      const customer = state.customers[0]
      setSelectedCustomerId(customer.id)
      setDeliveryAddress(customer.defaultAddress)
      setDeliveryAddressError(null)
    }

    if (session.user.role === 'merchant') {
      pageState.setMerchantDraft((current: any) => ({
        ...current,
        merchantName: session.user.displayName,
      }))
    }

    if (session.user.role !== 'customer' && !selectedStoreId && state.stores.length > 0) {
      const store = state.stores[0]
      setSelectedStoreId(store.id)
      setQuantities(getInitialQuantities(store))
    }

    if (session.user.role === 'rider' && session.user.linkedProfileId) {
      setSelectedRiderId(session.user.linkedProfileId)
    } else if (!selectedRiderId && state.riders.length > 0) {
      setSelectedRiderId(state.riders[0].id)
    }
  }, [
    pageState,
    selectedRiderId,
    selectedStoreId,
    session,
    setDeliveryAddress,
    setDeliveryAddressError,
    setQuantities,
    setSelectedCustomerId,
    setSelectedRiderId,
    setSelectedStoreId,
    state,
  ])

  useEffect(() => {
    if (!session) return

    if (session.user.role === 'customer') {
      if (
        locationPathname !== '/customer/profile/addresses' &&
        !locationPathname.startsWith('/customer/')
      ) {
        navigate('/customer/order', { replace: true })
      }
      return
    }

    if (session.user.role === 'merchant') {
      if (!locationPathname.startsWith('/merchant/')) {
        navigate('/merchant/application?merchantView=submit', { replace: true })
      }
      return
    }

    if (locationPathname.startsWith('/customer/') || locationPathname.startsWith('/merchant/')) {
      navigate('/', { replace: true })
    }
  }, [locationPathname, navigate, session])

  useEffect(() => {
    if (!state || !session || session.user.role !== 'customer') return
    if (locationPathname !== '/customer/order') return

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
    if (!session || session.user.role !== 'merchant') return
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
      payoutAccountType: merchantProfile.payoutAccount?.accountType ?? 'alipay',
      bankName: merchantProfile.payoutAccount?.bankName ?? '',
      accountNumber: merchantProfile.payoutAccount?.accountNumber ?? '',
      accountHolder: merchantProfile.payoutAccount?.accountHolder ?? '',
    })
    pageState.setMerchantProfileFormErrors({})
  }, [lastMerchantProfileDraftSyncIdRef, merchantProfile, pageState, setMerchantProfileDraft])

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
    navigate('/customer/orders', { replace: true })
  }, [activeReviewOrder, customerWorkspaceView, navigate])

  useEffect(() => {
    if (customerWorkspaceView !== 'order-detail') return
    if (activeCustomerOrder) return
    navigate('/customer/orders', { replace: true })
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
