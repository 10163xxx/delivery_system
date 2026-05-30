import {
  MAX_CUSTOMER_STORE_SEARCH_HISTORY,
  getInitialQuantities,
} from '@/features/delivery/DeliveryServices'
import {
  readCustomerBlockedStoreIds as readCustomerBlockedStoreIdsFromStorage,
  readCustomerFavoriteStoreIds as readCustomerFavoriteStoreIdsFromStorage,
  readSeenCustomerProfileNoticeIds as readSeenCustomerProfileNoticeIdsFromStorage,
  saveCustomerStoreSearchHistory,
} from '@/system/api/SharedApi'
import { MERCHANT_WORKSPACE_VIEW } from '@/objects/page/DeliveryAppObjects'
import {
  PAYOUT_ACCOUNT_TYPE,
  ROLE,
  ROUTE_QUERY_KEY,
  type Customer,
  type PersonName,
  type Store,
  type StoreId,
} from '@/objects/core/SharedObjects'
import type {
  ResetInvalidMerchantStoreSelectionArgs,
  SyncMerchantProfileDraftArgs,
  SyncPageStateArgs,
  SyncStoreRouteArgs,
} from '@/objects/page/DeliveryPageViewEffectSupportObjects'

export function readSeenCustomerProfileNoticeIds(userId: string) {
  return readSeenCustomerProfileNoticeIdsFromStorage(userId)
}

export function readCustomerFavoriteStoreIds(userId: string) {
  return readCustomerFavoriteStoreIdsFromStorage(userId)
}

export function readCustomerBlockedStoreIds(userId: string) {
  return readCustomerBlockedStoreIdsFromStorage(userId)
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
            merchantName: session.user.displayName as PersonName,
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
    setSelectedRiderId(session.user.linkedProfileId as SyncPageStateArgs['selectedRiderId'])
  } else if (!selectedRiderId && state.riders.length > 0) {
    const rider = state.riders[0]
    if (rider) {
      setSelectedRiderId(rider.id)
    }
  }
}

export function syncSelectedStoreFromRoute(args: SyncStoreRouteArgs) {
  const {
    blockedStoreIds,
    searchParams,
    selectedStoreCategory,
    selectedStoreId,
    setQuantities,
    setSelectedStoreCategory,
    setSelectedStoreId,
    state,
  } = args
  const storeIdFromUrl = (searchParams.get(ROUTE_QUERY_KEY.store) ?? '') as StoreId | ''
  const store = state.stores.find(
    (entry: Store) => entry.id === storeIdFromUrl && !blockedStoreIds.includes(entry.id),
  )
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
  saveCustomerStoreSearchHistory(next)
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
