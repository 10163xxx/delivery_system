import {
  MAX_CUSTOMER_STORE_SEARCH_HISTORY,
  getInitialQuantities,
} from '@/shared/delivery/DeliveryServices'
import { browserStorage } from '@/shared/api/SharedApi'
import { MERCHANT_WORKSPACE_VIEW } from '@/shared/object/core/DeliveryAppObjects'
import { PAYOUT_ACCOUNT_TYPE, ROLE, type Customer, type Store } from '@/shared/object/core/SharedObjects'
import type {
  ResetInvalidMerchantStoreSelectionArgs,
  SyncMerchantProfileDraftArgs,
  SyncPageStateArgs,
  SyncStoreRouteArgs,
} from '@/shared/object/core/DeliveryPageViewEffectSupportObjects'

export function readSeenCustomerProfileNoticeIds(userId: string) {
  return browserStorage.readSeenCustomerProfileNoticeIds(userId)
}

export function syncSessionBoundPageState(args: SyncPageStateArgs) {
  const {
    state,
    session,
    selectedCustomerId,
    selectedRiderId,
    selectedStoreId,
    setDeliveryAddress,
    setDeliveryAddressError,
    setMerchantDraft,
    setQuantities,
    setSelectedCustomerId,
    setSelectedRiderId,
    setSelectedStoreId,
  } = args

  if (session.user.role === ROLE.customer && session.user.linkedProfileId) {
    const customer = state.customers.find((entry: Customer) => entry.id === session.user.linkedProfileId)
    if (customer) {
      setSelectedCustomerId(customer.id)
      setDeliveryAddress(customer.defaultAddress)
      setDeliveryAddressError(null)
    }
  } else if (!selectedCustomerId && state.customers.length > 0) {
    const customer = state.customers[0]
    if (customer) {
      setSelectedCustomerId(customer.id)
      setDeliveryAddress(customer.defaultAddress)
      setDeliveryAddressError(null)
    }
  }

  if (session.user.role === ROLE.merchant) {
    setMerchantDraft((current) =>
      current.merchantName === session.user.displayName
        ? current
        : {
            ...current,
            merchantName: session.user.displayName,
          },
    )
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
}

export function syncSelectedStoreFromRoute(args: SyncStoreRouteArgs) {
  const {
    searchParams,
    selectedStoreCategory,
    selectedStoreId,
    setQuantities,
    setSelectedStoreCategory,
    setSelectedStoreId,
    state,
  } = args
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
}

export function syncMerchantProfileDraft(args: SyncMerchantProfileDraftArgs) {
  const {
    merchantProfile,
    lastMerchantProfileDraftSyncIdRef,
    setMerchantProfileDraft,
    setMerchantProfileFormErrors,
  } = args
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
}

export function appendCustomerStoreSearchHistory(
  keyword: string,
  current: string[],
) {
  const normalized = keyword.toLowerCase()
  const next = [
    keyword,
    ...current.filter((entry: string) => entry.toLowerCase() !== normalized),
  ].slice(0, MAX_CUSTOMER_STORE_SEARCH_HISTORY)
  browserStorage.saveCustomerStoreSearchHistory(next)
  return next
}

export function resetInvalidMerchantStoreSelection(args: ResetInvalidMerchantStoreSelectionArgs) {
  const {
    merchantStores,
    merchantWorkspaceView,
    selectedMerchantStoreId,
    setSelectedMerchantStoreId,
  } = args
  if (!selectedMerchantStoreId) return
  if (merchantWorkspaceView !== MERCHANT_WORKSPACE_VIEW.console) {
    setSelectedMerchantStoreId('')
    return
  }
  if (merchantStores.some((store: Store) => store.id === selectedMerchantStoreId)) return
  setSelectedMerchantStoreId('')
}
