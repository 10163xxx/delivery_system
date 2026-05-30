import type { Dispatch, SetStateAction } from 'react'
import type {
  MerchantDraftContext,
  RunAction,
} from '@/objects/merchant/page/MerchantActionObjects'
import {
  createMerchantDraftSelectors,
  createMerchantDraftSubmitActions,
  createMerchantDraftUploadActions,
  createMerchantDraftValidators,
} from '@/pages/delivery/app/actions/merchant/draft/MerchantDraftActionHelpers'

export function createMerchantDraftActions(
  draft: MerchantDraftContext,
  runAction: RunAction,
  setError: Dispatch<SetStateAction<string | null>>,
) {
  const selectors = createMerchantDraftSelectors(draft)
  const validators = createMerchantDraftValidators(draft)
  const submitActions = createMerchantDraftSubmitActions(
    draft,
    runAction,
    setError,
    selectors,
    validators,
  )
  const uploadActions = createMerchantDraftUploadActions(draft, setError)

  return {
    getMenuItemDraft: selectors.getMenuItemDraft,
    isMenuComposerExpanded: selectors.isMenuComposerExpanded,
    isMenuItemImageUploading: selectors.isMenuItemImageUploading,
    submitMerchantApplication: submitActions.submitMerchantApplication,
    submitStoreMenuItem: submitActions.submitStoreMenuItem,
    uploadMerchantImage: uploadActions.uploadMerchantImage,
    uploadStoreMenuImage: uploadActions.uploadStoreMenuImage,
  }
}
