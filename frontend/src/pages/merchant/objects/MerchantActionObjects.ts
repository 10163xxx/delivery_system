import type { Dispatch, SetStateAction } from 'react'
import type {
  DeliveryAppState,
  DisplayText,
  MerchantProfile,
  PersonName,
  RefundRequestId,
  StoreId,
} from '@/objects/core/SharedObjects'
import type {
  MenuItemDraft,
  MenuItemFormField,
  MerchantDraft,
  MerchantFormField,
  MerchantProfileDraft,
  MerchantProfileFormField,
} from '@/pages/delivery/objects/DeliveryAppObjects'

export type RunAction = (action: () => Promise<DeliveryAppState>) => Promise<boolean>

type MerchantDraftState = {
  merchantDraft: MerchantDraft
  isMerchantImageUploading: boolean
  currentDisplayName: PersonName
  menuItemDrafts: Record<StoreId, MenuItemDraft>
  menuComposerOpen: Record<StoreId, boolean>
  menuItemImageUploading: Record<StoreId, boolean>
}

type MerchantDraftSetters = {
  setMerchantDraft: Dispatch<SetStateAction<MerchantDraft>>
  setMerchantFormErrors: Dispatch<SetStateAction<Partial<Record<MerchantFormField, DisplayText>>>>
  setMenuItemFormErrors: Dispatch<SetStateAction<Record<StoreId, Partial<Record<MenuItemFormField, DisplayText>>>>>
  setMenuItemDrafts: Dispatch<SetStateAction<Record<StoreId, MenuItemDraft>>>
  setMenuComposerOpen: Dispatch<SetStateAction<Record<StoreId, boolean>>>
  setIsMerchantImageUploading: Dispatch<SetStateAction<boolean>>
  setMenuItemImageUploading: Dispatch<SetStateAction<Record<StoreId, boolean>>>
}

export type MerchantDraftContext = MerchantDraftState & MerchantDraftSetters

export type MerchantProfileContext = {
  merchantProfileDraft: MerchantProfileDraft
  merchantProfile: MerchantProfile | undefined
  setMerchantProfileFormErrors: Dispatch<SetStateAction<Partial<Record<MerchantProfileFormField, DisplayText>>>>
}

export type MerchantWithdrawContext = {
  merchantProfile: MerchantProfile | undefined
  merchantWithdrawAmount: DisplayText
  setMerchantWithdrawAmount: Dispatch<SetStateAction<DisplayText>>
  setMerchantWithdrawFieldError: Dispatch<SetStateAction<DisplayText | null>>
}

export type MerchantOrderIssueContext = {
  partialRefundResolutionDrafts: Record<RefundRequestId, DisplayText>
  setPartialRefundResolutionDrafts: Dispatch<SetStateAction<Record<RefundRequestId, DisplayText>>>
}

export type MerchantActionParams = {
  runAction: RunAction
  setError: Dispatch<SetStateAction<DisplayText | null>>
  draft: MerchantDraftContext
  profile: MerchantProfileContext
  withdraw: MerchantWithdrawContext
  orderIssue: MerchantOrderIssueContext
}
