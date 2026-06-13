import { useEffect } from 'react'
import {
  ROLE,
  ROUTE_PATH,
  ROUTE_PATH_PREFIX,
  type CustomerId,
  type RiderId,
  type StoreId,
} from '@/objects/core/SharedObjects'
import type {
  DeliveryPageState,
  DeliveryPageViewEffectsArgs,
  SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import { syncSessionBoundPageState } from '@/pages/DeliveryConsole/functions/storage/DeliveryEffectStorage'

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
        !locationPathname.startsWith(ROUTE_PATH_PREFIX.customer)
      ) {
        navigate(ROUTE_PATH.customerOrder, { replace: true })
      }
      return
    }

    if (session.user.role === ROLE.merchant) {
      if (!locationPathname.startsWith(ROUTE_PATH_PREFIX.merchant)) {
        navigate(ROUTE_PATH.merchantApplicationSubmit, { replace: true })
      }
      return
    }

    if (
      locationPathname.startsWith(ROUTE_PATH_PREFIX.customer) ||
      locationPathname.startsWith(ROUTE_PATH_PREFIX.merchant)
    ) {
      navigate(ROUTE_PATH.root, { replace: true })
    }
  }, [locationPathname, navigate, session])
}

export function useSessionBoundStateSyncEffect(args: {
  state: SessionState['state']
  session: SessionState['session']
  selectedCustomerId: CustomerId | ''
  selectedRiderId: RiderId | ''
  selectedStoreId: StoreId | ''
  setDeliveryAddress: DeliveryPageState['checkout']['setDeliveryAddress']
  setDeliveryAddressError: DeliveryPageState['checkout']['setDeliveryAddressError']
  setMerchantDraft: DeliveryPageState['setMerchantDraft']
  setQuantities: DeliveryPageState['checkout']['setQuantities']
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
