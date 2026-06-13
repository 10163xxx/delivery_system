import { useEffect } from 'react'
import { ROLE, type MerchantProfile, type Store, type StoreId } from '@/objects/core/SharedObjects'
import type {
  DeliveryPageState,
  SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import type { MerchantApplicationView, MerchantWorkspaceView } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import {
  resetInvalidMerchantStoreSelection,
  syncMerchantProfileDraft,
} from '@/pages/DeliveryConsole/functions/storage/DeliveryEffectStorage'

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

export function useMerchantSelectionGuardEffect(args: {
  session: SessionState['session']
  merchantStores: Store[]
  merchantWorkspaceView: MerchantWorkspaceView
  selectedMerchantStoreId: StoreId | ''
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
  }, [merchantStores, merchantWorkspaceView, selectedMerchantStoreId, session, setSelectedMerchantStoreId])
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
  }, [lastMerchantProfileDraftSyncIdRef, merchantProfile, setMerchantProfileDraft, setMerchantProfileFormErrors])
}
