import type { Dispatch, SetStateAction } from 'react'
import {
  addMenuItem,
  submitMerchantApplication as submitMerchantApplicationApi,
  uploadMerchantStoreImage,
} from '@/system/api/SharedApi'
import {
  buildMenuItemPayload,
  buildMerchantRegistrationPayload,
  createInitialMenuItemDraft,
  createInitialMerchantDraft,
  DELIVERY_CONSOLE_MESSAGES,
  validateMenuItemDraft,
  validateMerchantDraft,
} from '@/features/delivery/DeliveryServices'
import { geocodeDeliveryAddress } from '@/features/delivery/DeliveryGeocoding'
import {
  MENU_ITEM_FORM_FIELD,
  MERCHANT_FORM_FIELD,
  type MenuItemDraft,
  type MenuItemFormField,
} from '@/pages/delivery/objects/DeliveryAppObjects'
import type { DisplayText, ImageUrl, StoreId } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/features/delivery/DeliveryShared'
import type { MerchantDraftContext, RunAction } from '@/pages/merchant/objects/MerchantActionObjects'

const MERCHANT_FORM_FIELDS = [
  MERCHANT_FORM_FIELD.merchantName,
  MERCHANT_FORM_FIELD.storeName,
  MERCHANT_FORM_FIELD.category,
  MERCHANT_FORM_FIELD.openTime,
  MERCHANT_FORM_FIELD.closeTime,
  MERCHANT_FORM_FIELD.imageUrl,
] as const

const MENU_ITEM_FORM_FIELDS = [
  MENU_ITEM_FORM_FIELD.name,
  MENU_ITEM_FORM_FIELD.category,
  MENU_ITEM_FORM_FIELD.description,
  MENU_ITEM_FORM_FIELD.priceYuan,
  MENU_ITEM_FORM_FIELD.remainingQuantity,
  MENU_ITEM_FORM_FIELD.imageUrl,
  MENU_ITEM_FORM_FIELD.selectionGroupsText,
] as const

function getUploadErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function getFirstInvalidField<T extends string>(
  fields: readonly T[],
  errors: Partial<Record<T, DisplayText>>,
) {
  return fields.find((field) => errors[field])
}

function setMenuImageUploading(
  setMenuItemImageUploading: MerchantDraftContext['setMenuItemImageUploading'],
  storeId: StoreId,
  isUploading: boolean,
) {
  setMenuItemImageUploading((current: Record<StoreId, boolean>) => ({ ...current, [storeId]: isUploading }))
}

export function createMerchantDraftSelectors(draft: MerchantDraftContext) {
  const { menuComposerOpen, menuItemDrafts, menuItemImageUploading, setMenuComposerOpen } = draft

  function getMenuItemDraft(storeId: StoreId) {
    return menuItemDrafts[storeId] ?? createInitialMenuItemDraft()
  }

  function isMenuItemImageUploading(storeId: StoreId) {
    return menuItemImageUploading[storeId] ?? false
  }

  function isMenuComposerExpanded(storeId: StoreId) {
    return menuComposerOpen[storeId] ?? false
  }

  function closeMenuComposer(storeId: StoreId) {
    setMenuComposerOpen((current: Record<StoreId, boolean>) => ({ ...current, [storeId]: false }))
  }

  return {
    getMenuItemDraft,
    isMenuItemImageUploading,
    isMenuComposerExpanded,
    closeMenuComposer,
  }
}

export function createMerchantDraftValidators(draft: MerchantDraftContext) {
  const { merchantDraft, setMerchantFormErrors, setMenuItemFormErrors } = draft

  function validateMerchantApplication() {
    const nextErrors = validateMerchantDraft(merchantDraft)
    setMerchantFormErrors(nextErrors)
    return getFirstInvalidField(MERCHANT_FORM_FIELDS, nextErrors)
  }

  function validateMenuItem(storeId: StoreId, menuDraft: MenuItemDraft) {
    const nextErrors = validateMenuItemDraft(menuDraft)
    setMenuItemFormErrors((current: Record<StoreId, Partial<Record<MenuItemFormField, DisplayText>>>) => ({
      ...current,
      [storeId]: nextErrors,
    }))
    return getFirstInvalidField(MENU_ITEM_FORM_FIELDS, nextErrors)
  }

  return {
    validateMerchantApplication,
    validateMenuItem,
  }
}

export function createMerchantDraftSubmitActions(
  draft: MerchantDraftContext,
  runAction: RunAction,
  setError: Dispatch<SetStateAction<DisplayText | null>>,
  selectors: ReturnType<typeof createMerchantDraftSelectors>,
  validators: ReturnType<typeof createMerchantDraftValidators>,
) {
  const {
    currentDisplayName,
    isMerchantImageUploading,
    merchantDraft,
    setMenuItemDrafts,
    setMenuItemFormErrors,
    setMerchantDraft,
    setMerchantFormErrors,
  } = draft

  async function submitMerchantApplication() {
    if (validators.validateMerchantApplication()) return
    if (isMerchantImageUploading) return setError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.upload.uploadInProgress))
    const location = await geocodeDeliveryAddress(merchantDraft.storeAddress)
    if (!location) {
      setMerchantFormErrors((current) => ({
        ...current,
        storeAddress: asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.profile.addressLocationRequired),
      }))
      return
    }
    const payload = buildMerchantRegistrationPayload(merchantDraft, location)
    await runAction(() => submitMerchantApplicationApi(payload))
    setMerchantDraft(createInitialMerchantDraft(currentDisplayName))
    setMerchantFormErrors({})
  }

  async function submitStoreMenuItem(storeId: StoreId) {
    const menuDraft = selectors.getMenuItemDraft(storeId)
    const payload = buildMenuItemPayload(menuDraft)
    if (validators.validateMenuItem(storeId, menuDraft)) return
    if (selectors.isMenuItemImageUploading(storeId)) {
      return setError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.upload.menuImageUploadInProgress))
    }
    const success = await runAction(() => addMenuItem(storeId, payload))
    if (!success) return
    setMenuItemDrafts((current: Record<StoreId, MenuItemDraft>) => ({
      ...current,
      [storeId]: createInitialMenuItemDraft(),
    }))
    setMenuItemFormErrors((current: Record<StoreId, Partial<Record<MenuItemFormField, DisplayText>>>) => ({
      ...current,
      [storeId]: {},
    }))
    selectors.closeMenuComposer(storeId)
  }

  return {
    submitMerchantApplication,
    submitStoreMenuItem,
  }
}

export function createMerchantDraftUploadActions(
  draft: MerchantDraftContext,
  setError: Dispatch<SetStateAction<DisplayText | null>>,
) {
  const {
    setIsMerchantImageUploading,
    setMenuItemDrafts,
    setMenuItemFormErrors,
    setMenuItemImageUploading,
    setMerchantDraft,
  } = draft

  async function uploadMerchantImage(file?: File) {
    if (!file) return
    setIsMerchantImageUploading(true)
    try {
      const uploaded = await uploadMerchantStoreImage(file)
      setMerchantDraft((current) => ({
        ...current,
        imageUrl: asDomainText<ImageUrl>(uploaded.url),
        uploadedImageName: asDomainText<DisplayText>(file.name),
      }))
      setError(null)
    } catch (uploadError) {
      setError(asDomainText<DisplayText>(getUploadErrorMessage(uploadError, DELIVERY_CONSOLE_MESSAGES.upload.imageUploadFailed)))
    } finally {
      setIsMerchantImageUploading(false)
    }
  }

  async function uploadStoreMenuImage(storeId: StoreId, file?: File) {
    if (!file) return
    setMenuImageUploading(setMenuItemImageUploading, storeId, true)
    try {
      const uploaded = await uploadMerchantStoreImage(file)
      setMenuItemDrafts((current: Record<StoreId, MenuItemDraft>) => ({
        ...current,
        [storeId]: {
          ...(current[storeId] ?? createInitialMenuItemDraft()),
          imageUrl: asDomainText<ImageUrl>(uploaded.url),
          uploadedImageName: asDomainText<DisplayText>(file.name),
        },
      }))
      setMenuItemFormErrors((current: Record<StoreId, Partial<Record<MenuItemFormField, string>>>) => ({
        ...current,
        [storeId]: { ...(current[storeId] ?? {}), imageUrl: undefined },
      }))
      setError(null)
    } catch (uploadError) {
      setError(asDomainText<DisplayText>(getUploadErrorMessage(uploadError, DELIVERY_CONSOLE_MESSAGES.upload.menuImageUploadFailed)))
    } finally {
      setMenuImageUploading(setMenuItemImageUploading, storeId, false)
    }
  }

  return {
    uploadMerchantImage,
    uploadStoreMenuImage,
  }
}
