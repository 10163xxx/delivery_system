import type { Dispatch, SetStateAction } from 'react'
import type { DeliveryAppState, MerchantProfile } from '@/shared/object'
import {
  addStoreMenuItem as addStoreMenuItemRequest,
  resolvePartialRefundRequest as resolvePartialRefundRequestCall,
  submitMerchantApplication as submitMerchantApplicationRequest,
  updateMerchantProfile as updateMerchantProfileRequest,
  uploadMerchantStoreImage as uploadMerchantStoreImageRequest,
  withdrawMerchantIncome as withdrawMerchantIncomeRequest,
} from '@/shared/api'
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
} from '@/shared/delivery'
import type {
  MenuItemDraft,
  MenuItemFormField,
  MerchantDraft,
  MerchantFormField,
  MerchantProfileDraft,
  MerchantProfileFormField,
} from '@/shared/delivery-app/object'

type RunAction = (action: () => Promise<DeliveryAppState>) => Promise<boolean>

type MerchantDraftContext = {
  merchantDraft: MerchantDraft
  isMerchantImageUploading: boolean
  currentDisplayName: string
  menuItemDrafts: Record<string, MenuItemDraft>
  menuComposerOpen: Record<string, boolean>
  menuItemImageUploading: Record<string, boolean>
  setMerchantDraft: Dispatch<SetStateAction<MerchantDraft>>
  setMerchantFormErrors: Dispatch<SetStateAction<Partial<Record<MerchantFormField, string>>>>
  setMenuItemFormErrors: Dispatch<SetStateAction<Record<string, Partial<Record<MenuItemFormField, string>>>>>
  setMenuItemDrafts: Dispatch<SetStateAction<Record<string, MenuItemDraft>>>
  setMenuComposerOpen: Dispatch<SetStateAction<Record<string, boolean>>>
  setIsMerchantImageUploading: Dispatch<SetStateAction<boolean>>
  setMenuItemImageUploading: Dispatch<SetStateAction<Record<string, boolean>>>
}

type MerchantProfileContext = {
  merchantProfileDraft: MerchantProfileDraft
  merchantProfile: MerchantProfile | undefined
  setMerchantProfileFormErrors: Dispatch<SetStateAction<Partial<Record<MerchantProfileFormField, string>>>>
}

type MerchantWithdrawContext = {
  merchantProfile: MerchantProfile | undefined
  merchantWithdrawAmount: string
  setMerchantWithdrawAmount: Dispatch<SetStateAction<string>>
  setMerchantWithdrawFieldError: Dispatch<SetStateAction<string | null>>
}

type MerchantSupportContext = {
  partialRefundResolutionDrafts: Record<string, string>
  setPartialRefundResolutionDrafts: Dispatch<SetStateAction<Record<string, string>>>
}

type Params = {
  runAction: RunAction
  setError: Dispatch<SetStateAction<string | null>>
  draft: MerchantDraftContext
  profile: MerchantProfileContext
  withdraw: MerchantWithdrawContext
  support: MerchantSupportContext
}

function removeKey<T>(record: Record<string, T>, key: string) {
  const next = { ...record }
  delete next[key]
  return next
}

function getUploadErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function getFirstInvalidField<T extends string>(
  fields: readonly T[],
  errors: Partial<Record<T, string>>,
) {
  return fields.find((field) => errors[field])
}

function setMenuImageUploading(
  setMenuItemImageUploading: MerchantDraftContext['setMenuItemImageUploading'],
  storeId: string,
  isUploading: boolean,
) {
  setMenuItemImageUploading((current: Record<string, boolean>) => ({
    ...current,
    [storeId]: isUploading,
  }))
}

function createMerchantDraftActions(
  draft: MerchantDraftContext,
  runAction: RunAction,
  setError: Dispatch<SetStateAction<string | null>>,
) {
  const {
    merchantDraft,
    isMerchantImageUploading,
    currentDisplayName,
    menuItemDrafts,
    menuComposerOpen,
    menuItemImageUploading,
    setMerchantDraft,
    setMerchantFormErrors,
    setMenuItemFormErrors,
    setMenuItemDrafts,
    setMenuComposerOpen,
    setIsMerchantImageUploading,
    setMenuItemImageUploading,
  } = draft

  function getMenuItemDraft(storeId: string) {
    return menuItemDrafts[storeId] ?? createInitialMenuItemDraft()
  }

  function isMenuItemImageUploading(storeId: string) {
    return menuItemImageUploading[storeId] ?? false
  }

  function isMenuComposerExpanded(storeId: string) {
    return menuComposerOpen[storeId] ?? false
  }

  function closeMenuComposer(storeId: string) {
    setMenuComposerOpen((current: Record<string, boolean>) => ({ ...current, [storeId]: false }))
  }

  function validateMerchantApplication() {
    const nextErrors = validateMerchantDraft(merchantDraft)
    setMerchantFormErrors(nextErrors)
    return getFirstInvalidField(
      ['merchantName', 'storeName', 'category', 'openTime', 'closeTime', 'imageUrl'] as const,
      nextErrors,
    )
  }

  function validateMenuItem(storeId: string, menuDraft: MenuItemDraft) {
    const nextErrors = validateMenuItemDraft(menuDraft)
    setMenuItemFormErrors((current: Record<string, Partial<Record<MenuItemFormField, string>>>) => ({
      ...current,
      [storeId]: nextErrors,
    }))
    return getFirstInvalidField(
      ['name', 'description', 'priceYuan', 'remainingQuantity', 'imageUrl'] as const,
      nextErrors,
    )
  }

  async function submitMerchantApplication() {
    const payload = buildMerchantRegistrationPayload(merchantDraft)
    if (validateMerchantApplication()) return
    if (isMerchantImageUploading) return setError(DELIVERY_CONSOLE_MESSAGES.uploadInProgress)
    await runAction(() => submitMerchantApplicationRequest(payload))
    setMerchantDraft(createInitialMerchantDraft(currentDisplayName))
    setMerchantFormErrors({})
  }

  async function submitStoreMenuItem(storeId: string) {
    const menuDraft = getMenuItemDraft(storeId)
    const payload = buildMenuItemPayload(menuDraft)
    if (validateMenuItem(storeId, menuDraft)) return
    if (isMenuItemImageUploading(storeId)) return setError(DELIVERY_CONSOLE_MESSAGES.menuImageUploadInProgress)
    const success = await runAction(() => addStoreMenuItemRequest(storeId, payload))
    if (!success) return
    setMenuItemDrafts((current: Record<string, MenuItemDraft>) => ({
      ...current,
      [storeId]: createInitialMenuItemDraft(),
    }))
    setMenuItemFormErrors((current: Record<string, Partial<Record<MenuItemFormField, string>>>) => ({
      ...current,
      [storeId]: {},
    }))
    closeMenuComposer(storeId)
  }

  async function uploadMerchantImage(file?: File) {
    if (!file) return
    setIsMerchantImageUploading(true)
    try {
      const uploaded = await uploadMerchantStoreImageRequest(file)
      setMerchantDraft((current: MerchantDraft) => ({
        ...current,
        imageUrl: uploaded.url,
        uploadedImageName: file.name,
      }))
      setError(null)
    } catch (uploadError) {
      setError(getUploadErrorMessage(uploadError, DELIVERY_CONSOLE_MESSAGES.imageUploadFailed))
    } finally {
      setIsMerchantImageUploading(false)
    }
  }

  async function uploadStoreMenuImage(storeId: string, file?: File) {
    if (!file) return
    setMenuImageUploading(setMenuItemImageUploading, storeId, true)
    try {
      const uploaded = await uploadMerchantStoreImageRequest(file)
      setMenuItemDrafts((current: Record<string, MenuItemDraft>) => ({
        ...current,
        [storeId]: {
          ...(current[storeId] ?? createInitialMenuItemDraft()),
          imageUrl: uploaded.url,
          uploadedImageName: file.name,
        },
      }))
      setMenuItemFormErrors((current: Record<string, Partial<Record<MenuItemFormField, string>>>) => ({
        ...current,
        [storeId]: { ...(current[storeId] ?? {}), imageUrl: undefined },
      }))
      setError(null)
    } catch (uploadError) {
      setError(getUploadErrorMessage(uploadError, DELIVERY_CONSOLE_MESSAGES.menuImageUploadFailed))
    } finally {
      setMenuImageUploading(setMenuItemImageUploading, storeId, false)
    }
  }

  return {
    getMenuItemDraft,
    isMenuItemImageUploading,
    isMenuComposerExpanded,
    submitMerchantApplication,
    submitStoreMenuItem,
    uploadMerchantImage,
    uploadStoreMenuImage,
  }
}

function createMerchantSupportActions(support: MerchantSupportContext, runAction: RunAction) {
  const { partialRefundResolutionDrafts, setPartialRefundResolutionDrafts } = support

  async function resolvePartialRefundRequest(refundId: string, approved: boolean) {
    const payload = buildPartialRefundResolutionPayload(
      approved,
      partialRefundResolutionDrafts[refundId] ?? '',
    )
    const success = await runAction(() => resolvePartialRefundRequestCall(refundId, payload))
    if (!success) return
    setPartialRefundResolutionDrafts((current: Record<string, string>) => removeKey(current, refundId))
  }

  return { resolvePartialRefundRequest }
}

function createMerchantProfileActions(profile: MerchantProfileContext, runAction: RunAction) {
  const { merchantProfileDraft, setMerchantProfileFormErrors } = profile

  async function saveMerchantProfile() {
    const payload = buildMerchantProfilePayload(merchantProfileDraft)
    const nextErrors = validateMerchantProfileDraft(merchantProfileDraft)
    setMerchantProfileFormErrors(nextErrors)
    if (nextErrors.contactPhone || nextErrors.bankName || nextErrors.accountNumber || nextErrors.accountHolder) return
    await runAction(() => updateMerchantProfileRequest(payload))
  }

  return { saveMerchantProfile }
}

function createMerchantWithdrawActions(withdraw: MerchantWithdrawContext, runAction: RunAction) {
  const {
    merchantProfile,
    merchantWithdrawAmount,
    setMerchantWithdrawAmount,
    setMerchantWithdrawFieldError,
  } = withdraw

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
    const success = await runAction(() =>
      withdrawMerchantIncomeRequest(buildMerchantWithdrawPayload(amount)),
    )
    if (!success) return
    setMerchantWithdrawAmount('')
  }

  return { withdrawMerchantIncome }
}

export function createMerchantActions(params: Params) {
  const { runAction, setError, draft, profile, withdraw, support } = params

  return {
    ...createMerchantDraftActions(draft, runAction, setError),
    ...createMerchantSupportActions(support, runAction),
    ...createMerchantProfileActions(profile, runAction),
    ...createMerchantWithdrawActions(withdraw, runAction),
  }
}
