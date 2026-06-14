import type {
  CustomerId,
  MerchantProfile,
  Rider,
  RiderId,
  StoreId,
} from '@/objects/core/SharedObjects'
import { ROLE } from '@/objects/core/SharedObjects'
import type {
  DeliveryPageDerivedState,
  SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'

export function getActiveCustomerId(
  session: SessionState['session'],
  selectedCustomerId: CustomerId | '',
) {
  return session?.user.role === ROLE.customer && session.user.linkedProfileId
    ? (session.user.linkedProfileId as unknown as CustomerId)
    : selectedCustomerId
}

export function getSelectedEntities(input: {
  state: DeliveryPageDerivedState
  session: SessionState['session']
  activeCustomerId: CustomerId | ''
  selectedStoreId: StoreId | ''
  selectedRiderId: RiderId | ''
  blockedStoreIds: StoreId[]
}) {
  const { state, session, activeCustomerId, selectedStoreId, selectedRiderId, blockedStoreIds } = input

  return {
    selectedStore: state?.stores.find(
      (store) => store.id === selectedStoreId && !blockedStoreIds.includes(store.id),
    ),
    selectedCustomer: state?.customers.find((customer) => customer.id === activeCustomerId),
    merchantProfile: state?.merchantProfiles.find(
      (profile: MerchantProfile) => profile.merchantName === session?.user.displayName,
    ),
    selectedRider: state?.riders.find((rider: Rider) => rider.id === selectedRiderId),
  }
}
