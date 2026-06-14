import type { CustomerActionParams } from '@/pages/CustomerConsole/objects/CustomerActionTypes'

export type CustomerOrderSelectionParams = Pick<
  CustomerActionParams,
  | 'selectedStore'
  | 'selectedStoreIsOpen'
  | 'selectedCustomer'
  | 'selectedCoupon'
  | 'customerRequiresDefaultAddressUpdate'
  | 'payableTotalCents'
>

export type CustomerOrderDraftParams = Pick<
  CustomerActionParams,
  | 'quantities'
  | 'selectedMenuItemConfigurations'
  | 'menuItemConfigurationModal'
  | 'deliveryAddress'
  | 'scheduledDeliveryTime'
  | 'scheduledDeliveryTouched'
  | 'remark'
  | 'orderChatDrafts'
>

export type CustomerOrderActionParams = Pick<
  CustomerActionParams,
  | 'runAction'
  | 'navigate'
  | 'setDeliveryAddressError'
  | 'setScheduledDeliveryError'
  | 'setScheduledDeliveryTime'
  | 'setScheduledDeliveryTouched'
  | 'setRemark'
  | 'setQuantities'
  | 'setSelectedMenuItemConfigurations'
  | 'setMenuItemConfigurationModal'
  | 'setIsCheckoutExpanded'
  | 'setSelectedCouponId'
  | 'setSelectedStoreCategory'
  | 'setSelectedStoreId'
  | 'setError'
  | 'setOrderChatErrors'
  | 'setOrderChatDrafts'
>

export type CustomerOrderParams = {
  selection: CustomerOrderSelectionParams
  draft: CustomerOrderDraftParams
  actions: CustomerOrderActionParams
}

export type OrderSubmissionValidationResult = { ok: true } | { ok: false }
