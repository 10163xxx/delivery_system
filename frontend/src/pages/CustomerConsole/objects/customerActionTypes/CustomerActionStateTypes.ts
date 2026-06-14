import type {
  DeliveryAppState,
  Store,
} from '@/objects/core/SharedObjects'

export type CustomerActionState = {
  state: DeliveryAppState | null
  selectedStore: Store | undefined
  selectedStoreIsOpen: boolean
  selectedCustomer: DeliveryAppState['customers'][number] | undefined
  selectedCoupon: DeliveryAppState['customers'][number]['coupons'][number] | null
  customerRequiresDefaultAddressUpdate: boolean
}
