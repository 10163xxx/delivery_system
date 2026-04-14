import {
  BANK_OPTIONS,
  buildEligibilityReviewPayload,
  buildReviewAppealPayload,
  getMenuItemFieldId,
  getMerchantFieldClassName,
  getMerchantFieldId,
} from '@/shared/delivery'
import {
  acceptOrder,
  readyOrder,
  removeStoreMenuItem,
  submitEligibilityReview,
  submitReviewAppeal,
} from '@/shared/api'
import type {
  MerchantPropsArgs,
  PageState,
  PageView,
  SessionService,
} from './types'
import { getSharedFormattingProps } from './shared'

function getMerchantViewProps(pageView: PageView, navigate: MerchantPropsArgs['navigate']) {
  return {
    currentDisplayName: pageView.currentDisplayName,
    enterMerchantStore: pageView.enterMerchantStore,
    leaveMerchantStore: pageView.leaveMerchantStore,
    merchantApplicationView: pageView.merchantApplicationView,
    merchantPendingApplications: pageView.merchantPendingApplications,
    merchantProfile: pageView.merchantProfile,
    merchantReviewedApplications: pageView.merchantReviewedApplications,
    merchantStores: pageView.merchantStores,
    merchantWithdrawError: pageView.merchantWithdrawError,
    merchantWorkspaceView: pageView.merchantWorkspaceView,
    navigate,
    role: pageView.role,
    statusLabels: pageView.statusLabels,
    STORE_CATEGORIES: pageView.STORE_CATEGORIES,
    setMerchantApplicationViewState: pageView.setMerchantApplicationViewState,
    setMerchantWorkspaceViewState: pageView.setMerchantWorkspaceViewState,
    ...getSharedFormattingProps(pageView),
  }
}

function getMerchantStateProps(pageState: PageState, sessionService: SessionService) {
  return {
    eligibilityReviewDrafts: pageState.eligibilityReviewDrafts,
    isMerchantImageUploading: pageState.isMerchantImageUploading,
    menuItemFormErrors: pageState.menuItemFormErrors,
    merchantAppealDrafts: pageState.merchantAppealDrafts,
    merchantDraft: pageState.merchantDraft,
    merchantFormErrors: pageState.merchantFormErrors,
    merchantProfileDraft: pageState.merchantProfileDraft,
    merchantProfileFormErrors: pageState.merchantProfileFormErrors,
    merchantWithdrawAmount: pageState.merchantWithdrawAmount,
    orderChatDrafts: pageState.orderChatDrafts,
    orderChatErrors: pageState.orderChatErrors,
    partialRefundResolutionDrafts: pageState.partialRefundResolutionDrafts,
    selectedMerchantStoreId: pageState.selectedMerchantStoreId,
    runAction: sessionService.runAction,
    setEligibilityReviewDrafts: pageState.setEligibilityReviewDrafts,
    setMenuComposerOpen: pageState.setMenuComposerOpen,
    setMenuItemDrafts: pageState.setMenuItemDrafts,
    setMenuItemFormErrors: pageState.setMenuItemFormErrors,
    setMerchantAppealDrafts: pageState.setMerchantAppealDrafts,
    setMerchantDraft: pageState.setMerchantDraft,
    setMerchantFormErrors: pageState.setMerchantFormErrors,
    setMerchantProfileDraft: pageState.setMerchantProfileDraft,
    setMerchantProfileFormErrors: pageState.setMerchantProfileFormErrors,
    setMerchantWithdrawAmount: pageState.setMerchantWithdrawAmount,
    setMerchantWithdrawFieldError: pageState.setMerchantWithdrawFieldError,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setPartialRefundResolutionDrafts: pageState.setPartialRefundResolutionDrafts,
    state: sessionService.state,
  }
}

function getMerchantUtilityProps() {
  return {
    BANK_OPTIONS,
    buildEligibilityReviewPayload,
    buildReviewAppealPayload,
    getMenuItemFieldId,
    getMerchantFieldClassName,
    getMerchantFieldId,
  }
}

export function buildMerchantProps({
  pageView,
  pageState,
  sessionService,
  navigate,
  getMenuItemDraft,
  isMenuComposerExpanded,
  isMenuItemImageUploading,
  resolvePartialRefundRequest,
  saveMerchantProfile,
  submitMerchantApplication,
  submitOrderChatMessage,
  submitStoreMenuItem,
  uploadMerchantImage,
  uploadStoreMenuImage,
  withdrawMerchantIncome,
}: MerchantPropsArgs) {
  return {
    ...getMerchantUtilityProps(),
    ...getMerchantViewProps(pageView, navigate),
    ...getMerchantStateProps(pageState, sessionService),
    getMenuItemDraft,
    isMenuComposerExpanded,
    isMenuItemImageUploading,
    resolvePartialRefundRequest,
    saveMerchantProfile,
    submitMerchantApplication,
    submitOrderChatMessage,
    submitStoreMenuItem,
    uploadMerchantImage,
    uploadStoreMenuImage,
    withdrawMerchantIncome,
    submitEligibilityReview,
    removeStoreMenuItem,
    acceptOrder,
    readyOrder,
    submitReviewAppeal,
  }
}
