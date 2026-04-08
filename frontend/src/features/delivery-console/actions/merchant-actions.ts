import type { Dispatch, SetStateAction } from 'react'
import type { DeliveryAppState, MerchantProfile } from '@/domain'
import {
  addStoreMenuItem as addStoreMenuItemRequest,
  resolvePartialRefundRequest as resolvePartialRefundRequestCall,
  submitMerchantApplication as submitMerchantApplicationRequest,
  updateMerchantProfile as updateMerchantProfileRequest,
  uploadMerchantStoreImage as uploadMerchantStoreImageRequest,
  withdrawMerchantIncome as withdrawMerchantIncomeRequest,
} from '@/api'
import {
  CURRENCY_CENTS_SCALE,
  buildMerchantProfilePayload,
  buildMerchantRegistrationPayload,
  buildMerchantWithdrawPayload,
  buildMenuItemPayload,
  buildPartialRefundResolutionPayload,
  createInitialMenuItemDraft,
  createInitialMerchantDraft,
  DELIVERY_CONSOLE_MESSAGES,
  MAX_WITHDRAW_AMOUNT_YUAN,
  parseMerchantWithdrawAmount,
  validateMenuItemDraft,
  validateMerchantDraft,
  validateMerchantProfileDraft,
} from '@/features/delivery-console'
import type {
  MenuItemDraft,
  MenuItemFormField,
  MerchantDraft,
  MerchantFormField,
  MerchantProfileDraft,
  MerchantProfileFormField,
} from '@/features/delivery-console'

type RunAction = (action: () => Promise<DeliveryAppState>) => Promise<boolean>

type Params = {
  merchantDraft: MerchantDraft
  isMerchantImageUploading: boolean
  currentDisplayName: string
  runAction: RunAction
  merchantProfileDraft: MerchantProfileDraft
  merchantProfile: MerchantProfile | undefined
  merchantWithdrawAmount: string
  partialRefundResolutionDrafts: Record<string, string>
  menuItemDrafts: Record<string, MenuItemDraft>
  menuItemImageUploading: Record<string, boolean>
  setMerchantDraft: Dispatch<SetStateAction<MerchantDraft>>
  setMerchantFormErrors: Dispatch<SetStateAction<Partial<Record<MerchantFormField, string>>>>
  setError: Dispatch<SetStateAction<string | null>>
  setMenuItemFormErrors: Dispatch<SetStateAction<Record<string, Partial<Record<MenuItemFormField, string>>>>>
  setMenuItemDrafts: Dispatch<SetStateAction<Record<string, MenuItemDraft>>>
  setMenuComposerOpen: Dispatch<SetStateAction<Record<string, boolean>>>
  setIsMerchantImageUploading: Dispatch<SetStateAction<boolean>>
  setMenuItemImageUploading: Dispatch<SetStateAction<Record<string, boolean>>>
  setMerchantProfileFormErrors: Dispatch<SetStateAction<Partial<Record<MerchantProfileFormField, string>>>>
  setMerchantWithdrawFieldError: Dispatch<SetStateAction<string | null>>
  setMerchantWithdrawAmount: Dispatch<SetStateAction<string>>
  setPartialRefundResolutionDrafts: Dispatch<SetStateAction<Record<string, string>>>
}

export function createMerchantActions(params: Params) {
  const {
    merchantDraft,
    isMerchantImageUploading,
    currentDisplayName,
    runAction,
    merchantProfileDraft,
    merchantProfile,
    merchantWithdrawAmount,
    partialRefundResolutionDrafts,
    menuItemDrafts,
    menuItemImageUploading,
    setMerchantDraft,
    setMerchantFormErrors,
    setError,
    setMenuItemFormErrors,
    setMenuItemDrafts,
    setMenuComposerOpen,
    setIsMerchantImageUploading,
    setMenuItemImageUploading,
    setMerchantProfileFormErrors,
    setMerchantWithdrawFieldError,
    setMerchantWithdrawAmount,
    setPartialRefundResolutionDrafts,
  } = params

  function getMenuItemDraft(storeId: string) {
    return menuItemDrafts[storeId] ?? createInitialMenuItemDraft()
  }

  function isMenuItemImageUploading(storeId: string) {
    return menuItemImageUploading[storeId] ?? false
  }

  function isMenuComposerExpanded(_storeId: string) {
    return false
  }

  async function resolvePartialRefundRequest(refundId: string, approved: boolean) {
    const payload = buildPartialRefundResolutionPayload(approved, partialRefundResolutionDrafts[refundId] ?? '')
    const success = await runAction(() => resolvePartialRefundRequestCall(refundId, payload))
    if (!success) return
    setPartialRefundResolutionDrafts((current) => {
      const next = { ...current }
      delete next[refundId]
      return next
    })
  }

  async function submitMerchantApplication() {
    const payload = buildMerchantRegistrationPayload(merchantDraft)
    const nextErrors = validateMerchantDraft(merchantDraft)
    setMerchantFormErrors(nextErrors)
    const firstInvalidField = (['merchantName', 'storeName', 'category', 'openTime', 'closeTime', 'imageUrl'] as MerchantFormField[]).find(
      (field) => nextErrors[field],
    )
    if (firstInvalidField) return
    if (isMerchantImageUploading) return setError(DELIVERY_CONSOLE_MESSAGES.uploadInProgress)
    await runAction(() => submitMerchantApplicationRequest(payload))
    setMerchantDraft(createInitialMerchantDraft(currentDisplayName))
    setMerchantFormErrors({})
  }

  async function submitStoreMenuItem(storeId: string) {
    const draft = getMenuItemDraft(storeId)
    const payload = buildMenuItemPayload(draft)
    const nextErrors = validateMenuItemDraft(draft)
    setMenuItemFormErrors((current) => ({ ...current, [storeId]: nextErrors }))
    const firstInvalidField = (['name', 'description', 'priceYuan', 'remainingQuantity', 'imageUrl'] as MenuItemFormField[]).find(
      (field) => nextErrors[field],
    )
    if (firstInvalidField) return
    if (isMenuItemImageUploading(storeId)) {
      return setError(DELIVERY_CONSOLE_MESSAGES.menuImageUploadInProgress)
    }
    const success = await runAction(() => addStoreMenuItemRequest(storeId, payload))
    if (!success) return
    setMenuItemDrafts((current) => ({ ...current, [storeId]: createInitialMenuItemDraft() }))
    setMenuItemFormErrors((current) => ({ ...current, [storeId]: {} }))
    setMenuComposerOpen((current) => ({ ...current, [storeId]: false }))
  }

  async function uploadMerchantImage(file?: File) {
    if (!file) return
    setIsMerchantImageUploading(true)
    try {
      const uploaded = await uploadMerchantStoreImageRequest(file)
      setMerchantDraft((current) => ({ ...current, imageUrl: uploaded.url, uploadedImageName: file.name }))
      setError(null)
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : DELIVERY_CONSOLE_MESSAGES.imageUploadFailed,
      )
    } finally {
      setIsMerchantImageUploading(false)
    }
  }

  async function uploadStoreMenuImage(storeId: string, file?: File) {
    if (!file) return
    setMenuItemImageUploading((current) => ({ ...current, [storeId]: true }))
    try {
      const uploaded = await uploadMerchantStoreImageRequest(file)
      setMenuItemDrafts((current) => ({
        ...current,
        [storeId]: { ...(current[storeId] ?? createInitialMenuItemDraft()), imageUrl: uploaded.url, uploadedImageName: file.name },
      }))
      setMenuItemFormErrors((current) => ({
        ...current,
        [storeId]: { ...(current[storeId] ?? {}), imageUrl: undefined },
      }))
      setError(null)
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : DELIVERY_CONSOLE_MESSAGES.menuImageUploadFailed,
      )
    } finally {
      setMenuItemImageUploading((current) => ({ ...current, [storeId]: false }))
    }
  }

  async function saveMerchantProfile() {
    const payload = buildMerchantProfilePayload(merchantProfileDraft)
    const nextErrors = validateMerchantProfileDraft(merchantProfileDraft)
    setMerchantProfileFormErrors(nextErrors)
    if (nextErrors.contactPhone || nextErrors.bankName || nextErrors.accountNumber || nextErrors.accountHolder) return
    await runAction(() => updateMerchantProfileRequest(payload))
  }

  async function withdrawMerchantIncome() {
    if (!merchantProfile) return
    const amount = parseMerchantWithdrawAmount(merchantWithdrawAmount)
    if (amount === null || amount <= 0) {
      return setMerchantWithdrawFieldError(DELIVERY_CONSOLE_MESSAGES.invalidWithdrawAmount)
    }
    if (amount > MAX_WITHDRAW_AMOUNT_YUAN) {
      return setMerchantWithdrawFieldError(DELIVERY_CONSOLE_MESSAGES.withdrawAmountTooLarge)
    }
    if (Math.round(amount * CURRENCY_CENTS_SCALE) > merchantProfile.availableToWithdrawCents) {
      return setMerchantWithdrawFieldError(
        DELIVERY_CONSOLE_MESSAGES.withdrawExceedsAvailableBalance,
      )
    }
    setMerchantWithdrawFieldError(null)
    const success = await runAction(() => withdrawMerchantIncomeRequest(buildMerchantWithdrawPayload(amount)))
    if (!success) return
    setMerchantWithdrawAmount('')
  }

  return {
    getMenuItemDraft,
    isMenuItemImageUploading,
    isMenuComposerExpanded,
    resolvePartialRefundRequest,
    submitMerchantApplication,
    submitStoreMenuItem,
    uploadMerchantImage,
    uploadStoreMenuImage,
    saveMerchantProfile,
    withdrawMerchantIncome,
  }
}
