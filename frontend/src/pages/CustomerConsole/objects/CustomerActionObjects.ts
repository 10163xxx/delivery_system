import type { CustomerActionParams } from '@/pages/CustomerConsole/objects/CustomerActionTypes'
import type { buildReviewPayload } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'

export type CustomerSearchParams = Pick<
  CustomerActionParams,
  | 'activeCustomerId'
  | 'customerStoreSearchDraft'
  | 'favoriteStoreIds'
  | 'blockedStoreIds'
  | 'setCustomerStoreSearchDraft'
  | 'setCustomerStoreSearch'
  | 'setCustomerStoreSearchHistory'
  | 'setFavoriteStoreIds'
  | 'setBlockedStoreIds'
>

export type CustomerRechargeParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customRechargeAmount'
  | 'selectedRechargeAmount'
  | 'runAction'
  | 'navigate'
  | 'setCustomRechargeAmount'
  | 'setSelectedRechargeAmount'
  | 'setRechargeFieldError'
>

export type CustomerProfileParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customerNameDraft'
  | 'addressDraft'
  | 'runAction'
  | 'setError'
  | 'setAddressFormErrors'
  | 'setAddressDraft'
  | 'setSession'
>

export type CustomerOrderIssueParams = Pick<
  CustomerActionParams,
  | 'state'
  | 'partialRefundDrafts'
  | 'afterSalesDrafts'
  | 'reviewDrafts'
  | 'runAction'
  | 'navigate'
  | 'setPartialRefundErrors'
  | 'setPartialRefundDrafts'
  | 'setAfterSalesErrors'
  | 'setAfterSalesDrafts'
  | 'setReviewErrors'
  | 'setReviewDrafts'
>

export type ReviewSubmissionValidationResult =
  | { ok: true; payload: ReturnType<typeof buildReviewPayload> }
  | { ok: false }

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

export type CustomerActionContexts = {
  search: CustomerSearchParams
  recharge: CustomerRechargeParams
  profile: CustomerProfileParams
  orderIssue: CustomerOrderIssueParams
  order: CustomerOrderParams
}
