import {
  BANK_OPTIONS,
  buildEligibilityReviewPayload,
  buildReviewAppealPayload,
  getMenuItemFieldId,
  getMerchantFieldClassName,
  getMerchantFieldId,
} from '@/shared/delivery/DeliveryServices'
import { deliveryApi } from '@/shared/api/SharedApi'
import type {
  MerchantActionArgs,
  MerchantPropsArgs,
} from '@/shared/object/core/AppBuildRolePropsObjects'

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
    submitEligibilityReview: deliveryApi.review.submitEligibilityReview,
    removeStoreMenuItem: deliveryApi.merchant.removeStoreMenuItem,
    acceptOrder: deliveryApi.order.acceptOrder,
    readyOrder: deliveryApi.order.readyOrder,
    submitReviewAppeal: deliveryApi.review.submitReviewAppeal,
  }
}
