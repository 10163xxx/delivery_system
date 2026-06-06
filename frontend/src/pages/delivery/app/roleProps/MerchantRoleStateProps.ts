import type {
  PageState,
  SessionService,
} from '@/pages/delivery/objects/AppBuildRolePropsObjects'

export function getMerchantDraftStateProps(pageState: PageState) {
  return {
    isMerchantImageUploading: pageState.isMerchantImageUploading,
    merchantDraft: pageState.merchantDraft,
    merchantFormErrors: pageState.merchantFormErrors,
    merchantProfileDraft: pageState.merchantProfileDraft,
    merchantProfileFormErrors: pageState.merchantProfileFormErrors,
    merchantWithdrawAmount: pageState.merchantWithdrawAmount,
    selectedMerchantStoreId: pageState.selectedMerchantStoreId,
  }
}

export function getMerchantOrderIssueStateProps(
  pageState: PageState,
  sessionService: SessionService,
) {
  return {
    eligibilityReviewDrafts: pageState.eligibilityReviewDrafts,
    menuItemFormErrors: pageState.menuItemFormErrors,
    merchantAppealDrafts: pageState.merchantAppealDrafts,
    orderChatDrafts: pageState.orderChatDrafts,
    orderChatErrors: pageState.orderChatErrors,
    partialRefundResolutionDrafts: pageState.partialRefundResolutionDrafts,
    runAction: sessionService.runAction,
    state: sessionService.state,
  }
}

export function getMerchantDraftSetters(pageState: PageState) {
  return {
    setMenuComposerOpen: pageState.setMenuComposerOpen,
    setMenuItemDrafts: pageState.setMenuItemDrafts,
    setMerchantDraft: pageState.setMerchantDraft,
    setMerchantFormErrors: pageState.setMerchantFormErrors,
    setMerchantProfileDraft: pageState.setMerchantProfileDraft,
    setMerchantProfileFormErrors: pageState.setMerchantProfileFormErrors,
    setMerchantWithdrawAmount: pageState.setMerchantWithdrawAmount,
    setMerchantWithdrawFieldError: pageState.setMerchantWithdrawFieldError,
  }
}

export function getMerchantOrderIssueSetters(pageState: PageState) {
  return {
    setEligibilityReviewDrafts: pageState.setEligibilityReviewDrafts,
    setMenuItemFormErrors: pageState.setMenuItemFormErrors,
    setMerchantAppealDrafts: pageState.setMerchantAppealDrafts,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setPartialRefundResolutionDrafts: pageState.setPartialRefundResolutionDrafts,
  }
}
