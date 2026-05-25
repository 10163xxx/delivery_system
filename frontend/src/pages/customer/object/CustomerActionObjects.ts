import type { CustomerActionParams } from '@/pages/customer/object/CustomerActionTypes'
import type { buildReviewPayload } from '@/shared/delivery/DeliveryServices'

export type CustomerSearchParams = Pick<
  CustomerActionParams,
  | 'customerStoreSearchDraft'
  | 'setCustomerStoreSearchDraft'
  | 'setCustomerStoreSearch'
  | 'setCustomerStoreSearchHistory'
>

export type CustomerRechargeParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customRechargeAmount'
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

export type CustomerSupportParams = Pick<
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

export type CustomerOrderParams = Pick<
  CustomerActionParams,
  | 'selectedStore'
  | 'selectedStoreIsOpen'
  | 'selectedCustomer'
  | 'selectedCoupon'
  | 'customerRequiresDefaultAddressUpdate'
  | 'quantities'
  | 'selectedMenuItemConfigurations'
  | 'menuItemConfigurationModal'
  | 'deliveryAddress'
  | 'scheduledDeliveryTime'
  | 'scheduledDeliveryTouched'
  | 'remark'
  | 'payableTotalCents'
  | 'orderChatDrafts'
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
  | 'setError'
  | 'setOrderChatErrors'
  | 'setOrderChatDrafts'
>

export type OrderSubmissionValidationResult = { ok: true } | { ok: false }

export type CustomerActionContexts = {
  search: CustomerSearchParams
  recharge: CustomerRechargeParams
  profile: CustomerProfileParams
  support: CustomerSupportParams
  order: CustomerOrderParams
}
