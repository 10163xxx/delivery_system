import type { Dispatch, SetStateAction } from 'react'
import type { DeliveryAppState, MerchantProfile } from '@/shared/object/core/SharedObjects'
import type {
  MenuItemDraft,
  MenuItemFormField,
  MerchantDraft,
  MerchantFormField,
  MerchantProfileDraft,
  MerchantProfileFormField,
} from '@/shared/object/core/DeliveryAppObjects'

export type RunAction = (action: () => Promise<DeliveryAppState>) => Promise<boolean>

type MerchantDraftState = {
  merchantDraft: MerchantDraft
  isMerchantImageUploading: boolean
  currentDisplayName: string
  menuItemDrafts: Record<string, MenuItemDraft>
  menuComposerOpen: Record<string, boolean>
  menuItemImageUploading: Record<string, boolean>
}

type MerchantDraftSetters = {
  setMerchantDraft: Dispatch<SetStateAction<MerchantDraft>>
  setMerchantFormErrors: Dispatch<SetStateAction<Partial<Record<MerchantFormField, string>>>>
  setMenuItemFormErrors: Dispatch<SetStateAction<Record<string, Partial<Record<MenuItemFormField, string>>>>>
  setMenuItemDrafts: Dispatch<SetStateAction<Record<string, MenuItemDraft>>>
  setMenuComposerOpen: Dispatch<SetStateAction<Record<string, boolean>>>
  setIsMerchantImageUploading: Dispatch<SetStateAction<boolean>>
  setMenuItemImageUploading: Dispatch<SetStateAction<Record<string, boolean>>>
}

export type MerchantDraftContext = MerchantDraftState & MerchantDraftSetters

export type MerchantProfileContext = {
  merchantProfileDraft: MerchantProfileDraft
  merchantProfile: MerchantProfile | undefined
  setMerchantProfileFormErrors: Dispatch<SetStateAction<Partial<Record<MerchantProfileFormField, string>>>>
}

export type MerchantWithdrawContext = {
  merchantProfile: MerchantProfile | undefined
  merchantWithdrawAmount: string
  setMerchantWithdrawAmount: Dispatch<SetStateAction<string>>
  setMerchantWithdrawFieldError: Dispatch<SetStateAction<string | null>>
}

export type MerchantSupportContext = {
  partialRefundResolutionDrafts: Record<string, string>
  setPartialRefundResolutionDrafts: Dispatch<SetStateAction<Record<string, string>>>
}

export type MerchantActionParams = {
  runAction: RunAction
  setError: Dispatch<SetStateAction<string | null>>
  draft: MerchantDraftContext
  profile: MerchantProfileContext
  withdraw: MerchantWithdrawContext
  support: MerchantSupportContext
}
