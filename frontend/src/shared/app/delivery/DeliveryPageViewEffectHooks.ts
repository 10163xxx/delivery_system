import type { DeliveryPageViewEffectsArgs } from '@/shared/object/core/DeliveryPageObjects'
import {
  useCheckoutCouponValidationEffect,
  useCustomerStoreRouteSyncEffect,
  useCustomerWorkspaceNavigationGuards,
  useMerchantSelectionGuardEffect,
  useRoleRouteGuardEffect,
} from './DeliveryPageViewEffectGuardHooks'
import {
  useCustomerDraftSyncEffect,
  useCustomerNoticeMarkSeenEffect,
  useCustomerProfileNoticeStorageEffects,
  useCustomerSearchHistoryEffect,
  useMerchantProfileDraftSyncEffect,
  useMerchantWorkspaceUrlSyncEffects,
  useSessionBoundStateSyncEffect,
} from './DeliveryViewSyncHooks'

export function useDeliveryConsoleGuardEffects(args: DeliveryPageViewEffectsArgs) {
  useRoleRouteGuardEffect(args.sessionService.session, args.locationPathname, args.navigate)
  useCustomerStoreRouteSyncEffect({
    state: args.sessionService.state,
    session: args.sessionService.session,
    locationPathname: args.locationPathname,
    searchParams: args.searchParams,
    selectedStoreCategory: args.selectedStoreCategory,
    selectedStoreId: args.selectedStoreId,
    setQuantities: args.pageState.setQuantities,
    setSelectedStoreCategory: args.pageState.setSelectedStoreCategory,
    setSelectedStoreId: args.pageState.setSelectedStoreId,
  })
  useMerchantSelectionGuardEffect({
    session: args.sessionService.session,
    merchantStores: args.merchantStores,
    merchantWorkspaceView: args.merchantWorkspaceView,
    selectedMerchantStoreId: args.selectedMerchantStoreId,
    setSelectedMerchantStoreId: args.pageState.setSelectedMerchantStoreId,
  })
  useCustomerWorkspaceNavigationGuards({
    customerWorkspaceView: args.customerWorkspaceView,
    activeReviewOrder: args.activeReviewOrder,
    activeCustomerOrder: args.activeCustomerOrder,
    searchParams: args.searchParams,
    selectedStore: args.selectedStore,
    quantities: args.quantities,
    navigate: args.navigate,
  })
  useCheckoutCouponValidationEffect({
    selectedStore: args.selectedStore,
    quantities: args.quantities,
    selectedCustomer: args.selectedCustomer,
    selectedCouponId: args.selectedCouponId,
    setSelectedCouponId: args.pageState.setSelectedCouponId,
  })
}

export function useDeliveryConsoleSyncEffects(args: DeliveryPageViewEffectsArgs) {
  const { session, state, setCustomerStoreSearchHistory } = args.sessionService
  const pageState = args.pageState

  useCustomerProfileNoticeStorageEffects(session, pageState.seenCustomerProfileNoticeIds, pageState.setSeenCustomerProfileNoticeIds)
  useMerchantWorkspaceUrlSyncEffects(args.merchantWorkspaceViewFromUrl, args.merchantApplicationViewFromUrl, pageState.setMerchantWorkspaceState, pageState.setMerchantApplicationState)
  useSessionBoundStateSyncEffect({
    state,
    session,
    selectedCustomerId: pageState.selectedCustomerId,
    selectedRiderId: args.selectedRiderId,
    selectedStoreId: args.selectedStoreId,
    setDeliveryAddress: pageState.setDeliveryAddress,
    setDeliveryAddressError: pageState.setDeliveryAddressError,
    setMerchantDraft: pageState.setMerchantDraft,
    setQuantities: pageState.setQuantities,
    setSelectedCustomerId: pageState.setSelectedCustomerId,
    setSelectedRiderId: pageState.setSelectedRiderId,
    setSelectedStoreId: pageState.setSelectedStoreId,
  })
  useCustomerDraftSyncEffect(args.selectedCustomer, pageState.lastCustomerDraftSyncIdRef, pageState.setCustomerNameDraft)
  useMerchantProfileDraftSyncEffect(args.merchantProfile, pageState.lastMerchantProfileDraftSyncIdRef, pageState.setMerchantProfileDraft, pageState.setMerchantProfileFormErrors)
  useCustomerNoticeMarkSeenEffect(session, args.customerWorkspaceView, args.customerProfileNoticeIds, pageState.setSeenCustomerProfileNoticeIds)
  useCustomerSearchHistoryEffect(pageState.customerStoreSearch, setCustomerStoreSearchHistory)
}
