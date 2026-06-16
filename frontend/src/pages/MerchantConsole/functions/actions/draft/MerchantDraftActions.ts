import type { Dispatch, SetStateAction } from 'react'
import type { DisplayText } from '@/objects/core/SharedObjects'
import type {
  MerchantDraftContext,
  RunAction,
} from '@/pages/MerchantConsole/objects/MerchantActionObjects'
import {
  createMerchantDraftSelectors,
  createMerchantDraftSubmitActions,
  createMerchantDraftUploadActions,
  createMerchantDraftValidators,
} from '@/pages/MerchantConsole/functions/actions/draft/MerchantDraftActionHelpers'

export function createMerchantDraftActions(
  draft: MerchantDraftContext,
  runAction: RunAction,
  setError: Dispatch<SetStateAction<DisplayText | null>>,
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
