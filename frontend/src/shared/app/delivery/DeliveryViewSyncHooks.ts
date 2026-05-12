import { useEffect } from 'react'
import { browserStorage } from '@/shared/api/SharedApi'
import { ROLE, type Customer, type MerchantProfile } from '@/shared/object/core/SharedObjects'
import type {
  DeliveryPageState,
  SessionState,
} from '@/shared/object/core/DeliveryPageObjects'
import {
  appendCustomerStoreSearchHistory,
  readSeenCustomerProfileNoticeIds,
  syncMerchantProfileDraft,
  syncSessionBoundPageState,
} from './DeliveryEffectStorage'
import {
  isCustomerProfileWorkspaceView,
} from '@/shared/object/core/DeliveryAppObjects'
import type {
  CustomerWorkspaceView,
  MerchantApplicationView,
  MerchantWorkspaceView,
} from '@/shared/object/core/DeliveryAppObjects'

export function useCustomerProfileNoticeStorageEffects(
  session: SessionState['session'],
  seenCustomerProfileNoticeIds: string[],
  setSeenCustomerProfileNoticeIds: DeliveryPageState['setSeenCustomerProfileNoticeIds'],
) {
  useEffect(() => {
    if (!session || session.user.role !== ROLE.customer) {
      setSeenCustomerProfileNoticeIds([])
      return
    }

    try {
      setSeenCustomerProfileNoticeIds(readSeenCustomerProfileNoticeIds(session.user.id))
    } catch {
      browserStorage.clearSeenCustomerProfileNoticeIds(session.user.id)
      setSeenCustomerProfileNoticeIds([])
    }
  }, [session, setSeenCustomerProfileNoticeIds])

  useEffect(() => {
    if (!session || session.user.role !== ROLE.customer) return

    browserStorage.saveSeenCustomerProfileNoticeIds(session.user.id, seenCustomerProfileNoticeIds)
  }, [seenCustomerProfileNoticeIds, session])
}

export function useMerchantWorkspaceUrlSyncEffects(
  merchantWorkspaceViewFromUrl: MerchantWorkspaceView,
  merchantApplicationViewFromUrl: MerchantApplicationView,
  setMerchantWorkspaceState: DeliveryPageState['setMerchantWorkspaceState'],
  setMerchantApplicationState: DeliveryPageState['setMerchantApplicationState'],
) {
  useEffect(() => {
    setMerchantWorkspaceState(merchantWorkspaceViewFromUrl)
  }, [merchantWorkspaceViewFromUrl, setMerchantWorkspaceState])

  useEffect(() => {
    setMerchantApplicationState(merchantApplicationViewFromUrl)
  }, [merchantApplicationViewFromUrl, setMerchantApplicationState])
}

export function useSessionBoundStateSyncEffect(args: {
  state: SessionState['state']
  session: SessionState['session']
  selectedCustomerId: string
  selectedRiderId: string
  selectedStoreId: string
  setDeliveryAddress: DeliveryPageState['setDeliveryAddress']
  setDeliveryAddressError: DeliveryPageState['setDeliveryAddressError']
  setMerchantDraft: DeliveryPageState['setMerchantDraft']
  setQuantities: DeliveryPageState['setQuantities']
  setSelectedCustomerId: DeliveryPageState['setSelectedCustomerId']
  setSelectedRiderId: DeliveryPageState['setSelectedRiderId']
  setSelectedStoreId: DeliveryPageState['setSelectedStoreId']
}) {
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

  useEffect(() => {
    if (!state || !session) return
    syncSessionBoundPageState({
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
    })
  }, [
    selectedCustomerId,
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
}

export function useCustomerDraftSyncEffect(
  selectedCustomer: Customer | undefined,
  lastCustomerDraftSyncIdRef: DeliveryPageState['lastCustomerDraftSyncIdRef'],
  setCustomerNameDraft: DeliveryPageState['setCustomerNameDraft'],
) {
  useEffect(() => {
    if (!selectedCustomer) return
    if (lastCustomerDraftSyncIdRef.current === selectedCustomer.id) return
    lastCustomerDraftSyncIdRef.current = selectedCustomer.id
    setCustomerNameDraft(selectedCustomer.name)
  }, [lastCustomerDraftSyncIdRef, selectedCustomer, setCustomerNameDraft])
}

export function useMerchantProfileDraftSyncEffect(
  merchantProfile: MerchantProfile | undefined,
  lastMerchantProfileDraftSyncIdRef: DeliveryPageState['lastMerchantProfileDraftSyncIdRef'],
  setMerchantProfileDraft: DeliveryPageState['setMerchantProfileDraft'],
  setMerchantProfileFormErrors: DeliveryPageState['setMerchantProfileFormErrors'],
) {
  useEffect(() => {
    if (!merchantProfile) return
    syncMerchantProfileDraft({
      merchantProfile,
      lastMerchantProfileDraftSyncIdRef,
      setMerchantProfileDraft,
      setMerchantProfileFormErrors,
    })
  }, [
    lastMerchantProfileDraftSyncIdRef,
    merchantProfile,
    setMerchantProfileDraft,
    setMerchantProfileFormErrors,
  ])
}

export function useCustomerNoticeMarkSeenEffect(
  session: SessionState['session'],
  customerWorkspaceView: CustomerWorkspaceView,
  customerProfileNoticeIds: string[],
  setSeenCustomerProfileNoticeIds: DeliveryPageState['setSeenCustomerProfileNoticeIds'],
) {
  useEffect(() => {
    if (!session || session.user.role !== ROLE.customer) return
    if (!isCustomerProfileWorkspaceView(customerWorkspaceView)) return
    if (customerProfileNoticeIds.length === 0) return

    setSeenCustomerProfileNoticeIds((current) => {
      const merged = new Set([...current, ...customerProfileNoticeIds])
      if (merged.size === current.length) return current
      return Array.from(merged)
    })
  }, [
    customerProfileNoticeIds,
    customerWorkspaceView,
    session,
    setSeenCustomerProfileNoticeIds,
  ])
}

export function useCustomerSearchHistoryEffect(
  customerStoreSearch: string,
  setCustomerStoreSearchHistory: SessionState['setCustomerStoreSearchHistory'],
) {
  useEffect(() => {
    const keyword = customerStoreSearch.trim()
    if (!keyword) return

    setCustomerStoreSearchHistory((current) =>
      appendCustomerStoreSearchHistory(keyword, current),
    )
  }, [customerStoreSearch, setCustomerStoreSearchHistory])
}
