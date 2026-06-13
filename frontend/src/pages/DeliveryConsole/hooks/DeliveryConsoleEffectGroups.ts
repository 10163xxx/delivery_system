import type { DeliveryPageViewEffectsArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import {
  useCheckoutCouponValidationEffect,
  useCustomerStoreRouteSyncEffect,
  useCustomerWorkspaceNavigationGuards,
} from '@/pages/CustomerConsole/hooks/CustomerPageEffects'
import {
  useCustomerDraftSyncEffect,
  useCustomerNoticeMarkSeenEffect,
  useCustomerProfileNoticeStorageEffects,
  useCustomerStorePreferenceStorageEffects,
  useCustomerSearchHistoryEffect,
} from '@/pages/CustomerConsole/hooks/CustomerPageEffects'
import {
  useMerchantSelectionGuardEffect,
  useMerchantProfileDraftSyncEffect,
  useMerchantWorkspaceUrlSyncEffects,
} from '@/pages/MerchantConsole/hooks/MerchantPageEffects'
import {
  useRoleRouteGuardEffect,
  useSessionBoundStateSyncEffect,
} from '@/pages/AuthScreen/hooks/AuthRouteEffects'

export function useDeliveryConsoleGuardEffects(args: DeliveryPageViewEffectsArgs) {
  useRoleRouteGuardEffect(args.sessionService.session, args.locationPathname, args.navigate)
  useCustomerStoreRouteSyncEffect({
    state: args.sessionService.state,
    session: args.sessionService.session,
    blockedStoreIds: args.sessionService.blockedStoreIds,
    locationPathname: args.locationPathname,
    searchParams: args.searchParams,
    selectedStoreCategory: args.selectedStoreCategory,
    selectedStoreId: args.selectedStoreId,
    setQuantities: args.pageState.checkout.setQuantities,
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
    selectedMenuItemConfigurations: args.selectedMenuItemConfigurations,
    navigate: args.navigate,
  })
  useCheckoutCouponValidationEffect({
    selectedStore: args.selectedStore,
    quantities: args.quantities,
    selectedMenuItemConfigurations: args.selectedMenuItemConfigurations,
    selectedCustomer: args.selectedCustomer,
    selectedCouponId: args.selectedCouponId,
    setSelectedCouponId: args.pageState.checkout.setSelectedCouponId,
  })
}

export function useDeliveryConsoleSyncEffects(args: DeliveryPageViewEffectsArgs) {
  const { session, state, setCustomerStoreSearchHistory } = args.sessionService
  const { setFavoriteStoreIds, setBlockedStoreIds } = args.sessionService
  const pageState = args.pageState

  useCustomerProfileNoticeStorageEffects(session, pageState.notices.seenCustomerProfileNoticeIds, pageState.notices.setSeenCustomerProfileNoticeIds)
  useMerchantWorkspaceUrlSyncEffects(args.merchantWorkspaceViewFromUrl, args.merchantApplicationViewFromUrl, pageState.setMerchantWorkspaceState, pageState.setMerchantApplicationState)
  useSessionBoundStateSyncEffect({
    state,
    session,
    selectedCustomerId: pageState.selectedCustomerId,
    selectedRiderId: args.selectedRiderId,
    selectedStoreId: args.selectedStoreId,
    setDeliveryAddress: pageState.checkout.setDeliveryAddress,
    setDeliveryAddressError: pageState.checkout.setDeliveryAddressError,
    setMerchantDraft: pageState.setMerchantDraft,
    setQuantities: pageState.checkout.setQuantities,
    setSelectedCustomerId: pageState.setSelectedCustomerId,
    setSelectedRiderId: pageState.setSelectedRiderId,
    setSelectedStoreId: pageState.setSelectedStoreId,
  })
  useCustomerDraftSyncEffect(args.selectedCustomer, pageState.lastCustomerDraftSyncIdRef, pageState.profile.setCustomerNameDraft)
  useCustomerStorePreferenceStorageEffects({
    selectedCustomer: args.selectedCustomer,
    setFavoriteStoreIds,
    setBlockedStoreIds,
  })
  useMerchantProfileDraftSyncEffect(args.merchantProfile, pageState.lastMerchantProfileDraftSyncIdRef, pageState.setMerchantProfileDraft, pageState.setMerchantProfileFormErrors)
  useCustomerNoticeMarkSeenEffect(session, args.customerWorkspaceView, args.customerProfileNoticeIds, pageState.notices.setSeenCustomerProfileNoticeIds)
  useCustomerSearchHistoryEffect(pageState.store.customerStoreSearch, setCustomerStoreSearchHistory)
}
