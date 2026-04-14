import type { Dispatch, SetStateAction } from 'react'
import type { AuthSession, DeliveryAppState, Store } from '@/shared/object'
import type {
  AfterSalesDraft,
  CustomerAddressDraft,
  CustomerAddressField,
  PartialRefundDraft,
  ReviewDraft,
} from '@/shared/delivery-app/object'

export type RunAction = (action: () => Promise<DeliveryAppState>) => Promise<boolean>

export type CustomerActionParams = {
  state: DeliveryAppState | null
  selectedStore: Store | undefined
  selectedStoreIsOpen: boolean
  selectedCustomer: DeliveryAppState['customers'][number] | undefined
  selectedCoupon: DeliveryAppState['customers'][number]['coupons'][number] | null
  quantities: Record<string, number>
  deliveryAddress: string
  scheduledDeliveryTime: string
  scheduledDeliveryTouched: boolean
  remark: string
  payableTotalCents: number
  partialRefundDrafts: Record<string, PartialRefundDraft>
  afterSalesDrafts: Record<string, AfterSalesDraft>
  reviewDrafts: Record<string, ReviewDraft>
  orderChatDrafts: Record<string, string>
  customerNameDraft: string
  addressDraft: CustomerAddressDraft
  customRechargeAmount: string
  runAction: RunAction
  navigate: (to: string, options?: { replace?: boolean }) => void
  customerStoreSearchDraft: string
  setCustomerStoreSearchDraft: Dispatch<SetStateAction<string>>
  setCustomerStoreSearch: Dispatch<SetStateAction<string>>
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
  setDeliveryAddressError: Dispatch<SetStateAction<string | null>>
  setScheduledDeliveryError: Dispatch<SetStateAction<string | null>>
  setScheduledDeliveryTime: Dispatch<SetStateAction<string>>
  setScheduledDeliveryTouched: Dispatch<SetStateAction<boolean>>
  setRemark: Dispatch<SetStateAction<string>>
  setQuantities: Dispatch<SetStateAction<Record<string, number>>>
  setIsCheckoutExpanded: Dispatch<SetStateAction<boolean>>
  setSelectedCouponId: Dispatch<SetStateAction<string>>
  setError: Dispatch<SetStateAction<string | null>>
  setOrderChatErrors: Dispatch<SetStateAction<Record<string, string>>>
  setOrderChatDrafts: Dispatch<SetStateAction<Record<string, string>>>
  setPartialRefundErrors: Dispatch<SetStateAction<Record<string, string>>>
  setPartialRefundDrafts: Dispatch<SetStateAction<Record<string, PartialRefundDraft>>>
  setAfterSalesErrors: Dispatch<SetStateAction<Record<string, string>>>
  setAfterSalesDrafts: Dispatch<SetStateAction<Record<string, AfterSalesDraft>>>
  setReviewErrors: Dispatch<SetStateAction<Record<string, string>>>
  setReviewDrafts: Dispatch<SetStateAction<Record<string, ReviewDraft>>>
  setAddressFormErrors: Dispatch<SetStateAction<Partial<Record<CustomerAddressField, string>>>>
  setAddressDraft: Dispatch<SetStateAction<CustomerAddressDraft>>
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  setCustomRechargeAmount: Dispatch<SetStateAction<string>>
  setSelectedRechargeAmount: Dispatch<SetStateAction<number | null>>
  setRechargeFieldError: Dispatch<SetStateAction<string | null>>
}
