import type { Dispatch, SetStateAction } from 'react'
import type {
  DisplayText,
  OrderId,
  PersonName,
} from '@/objects/core/SharedObjects'
import type {
  AfterSalesDraft,
  PartialRefundDraft,
  PartialRefundDraftKey,
  ReviewDraft,
  ReviewDraftKey,
} from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type {
  CustomerAddressDraft,
  CustomerAddressField,
} from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'

export type CustomerDraftState = {
  partialRefundDrafts: Record<PartialRefundDraftKey, PartialRefundDraft>
  afterSalesDrafts: Record<OrderId, AfterSalesDraft>
  reviewDrafts: Record<ReviewDraftKey, ReviewDraft>
  orderChatDrafts: Record<OrderId, DisplayText>
  customerNameDraft: PersonName
  addressDraft: CustomerAddressDraft
  customRechargeAmount: DisplayText
  selectedRechargeAmount: number | null
}

export type CustomerDraftSetters = {
  setOrderChatErrors: Dispatch<SetStateAction<Record<OrderId, DisplayText>>>
  setOrderChatDrafts: Dispatch<SetStateAction<Record<OrderId, DisplayText>>>
  setPartialRefundErrors: Dispatch<SetStateAction<Record<PartialRefundDraftKey, DisplayText>>>
  setPartialRefundDrafts: Dispatch<SetStateAction<Record<PartialRefundDraftKey, PartialRefundDraft>>>
  setAfterSalesErrors: Dispatch<SetStateAction<Record<OrderId, DisplayText>>>
  setAfterSalesDrafts: Dispatch<SetStateAction<Record<OrderId, AfterSalesDraft>>>
  setReviewErrors: Dispatch<SetStateAction<Record<ReviewDraftKey, DisplayText>>>
  setReviewDrafts: Dispatch<SetStateAction<Record<ReviewDraftKey, ReviewDraft>>>
  setAddressFormErrors: Dispatch<SetStateAction<Partial<Record<CustomerAddressField, DisplayText>>>>
}
