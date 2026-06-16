import { BANK_OPTIONS } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { buildEligibilityReviewPayload, buildReviewAppealPayload } from '@/pages/AdminConsole/functions/payloads/DeliveryPayloadReviewAdmin'
import { getMenuItemFieldId, getMerchantFieldClassName, getMerchantFieldId } from '@/pages/DeliveryConsole/functions/validation/DeliveryValidationFields'
import {
  acceptOrder,
  appendStoreReviewReply,
  readyOrder,
  removeMenuItem,
  submitEligibilityReview,
  submitReviewAppeal,
} from '@/system/api/SharedApi'
import type {
  MerchantActionArgs,
  MerchantPropsArgs,
} from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'

export function getMerchantUtilityFieldProps() {
  return {
    BANK_OPTIONS,
    buildEligibilityReviewPayload,
    buildReviewAppealPayload,
    getMenuItemFieldId,
    getMerchantFieldClassName,
    getMerchantFieldId,
  }
}

export function getMerchantActionProps(args: MerchantActionArgs) {
  return {
    getMenuItemDraft: args.getMenuItemDraft,
    isMenuComposerExpanded: args.isMenuComposerExpanded,
    isMenuItemImageUploading: args.isMenuItemImageUploading,
    resolvePartialRefundRequest: args.resolvePartialRefundRequest,
    saveMerchantProfile: args.saveMerchantProfile,
    submitMerchantApplication: args.submitMerchantApplication,
    submitStoreMenuItem: args.submitStoreMenuItem,
    uploadMerchantImage: args.uploadMerchantImage,
    uploadStoreMenuImage: args.uploadStoreMenuImage,
    withdrawMerchantIncome: args.withdrawMerchantIncome,
  }
}

export function getMerchantApiActionProps(
  submitOrderChatMessage: MerchantPropsArgs['submitOrderChatMessage'],
) {
  return {
    submitOrderChatMessage,
    submitEligibilityReview,
    removeMenuItem,
    acceptOrder,
    readyOrder,
    appendStoreReviewReply,
    submitReviewAppeal,
  }
}
