import { useState } from 'react'
import type { DisplayText, OrderId, RiderId, StoreId } from '@/objects/core/SharedObjects'
import { createInitialMerchantDraft, createInitialMerchantProfileDraft } from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { MenuItemDraft, MerchantDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type {
  MenuItemFormField,
  MerchantFormField,
  MerchantProfileDraft,
  MerchantProfileFormField,
} from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'

export function useMerchantPageState() {
  const [merchantProfileDraft, setMerchantProfileDraft] = useState<MerchantProfileDraft>(
    createInitialMerchantProfileDraft(),
  )
  const [merchantProfileFormErrors, setMerchantProfileFormErrors] = useState<
    Partial<Record<MerchantProfileFormField, DisplayText>>
  >({})
  const [merchantWithdrawAmount, setMerchantWithdrawAmount] = useState<DisplayText>(asDomainText<DisplayText>(''))
  const [merchantWithdrawFieldError, setMerchantWithdrawFieldError] = useState<DisplayText | null>(null)
  const [merchantDraft, setMerchantDraft] = useState<MerchantDraft>(createInitialMerchantDraft())
  const [merchantFormErrors, setMerchantFormErrors] = useState<
    Partial<Record<MerchantFormField, DisplayText>>
  >({})
  const [isMerchantImageUploading, setIsMerchantImageUploading] = useState(false)
  const [menuItemDrafts, setMenuItemDrafts] = useState<Record<StoreId, MenuItemDraft>>({})
  const [menuComposerOpen, setMenuComposerOpen] = useState<Record<StoreId, boolean>>({})
  const [menuItemFormErrors, setMenuItemFormErrors] = useState<
    Record<StoreId, Partial<Record<MenuItemFormField, DisplayText>>>
  >({})
  const [menuItemImageUploading, setMenuItemImageUploading] = useState<Record<StoreId, boolean>>({})
  const [merchantAppealDrafts, setMerchantAppealDrafts] = useState<Record<OrderId, DisplayText>>({})
  const [eligibilityReviewDrafts, setEligibilityReviewDrafts] = useState<Record<StoreId | RiderId, DisplayText>>({})

  return {
    merchantProfileDraft,
    setMerchantProfileDraft,
    merchantProfileFormErrors,
    setMerchantProfileFormErrors,
    merchantWithdrawAmount,
    setMerchantWithdrawAmount,
    merchantWithdrawFieldError,
    setMerchantWithdrawFieldError,
    merchantDraft,
    setMerchantDraft,
    merchantFormErrors,
    setMerchantFormErrors,
    isMerchantImageUploading,
    setIsMerchantImageUploading,
    menuItemDrafts,
    setMenuItemDrafts,
    menuComposerOpen,
    setMenuComposerOpen,
    menuItemFormErrors,
    setMenuItemFormErrors,
    menuItemImageUploading,
    setMenuItemImageUploading,
    merchantAppealDrafts,
    setMerchantAppealDrafts,
    eligibilityReviewDrafts,
    setEligibilityReviewDrafts,
  }
}
