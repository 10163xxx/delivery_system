import { createMerchantActions } from '@/pages/DeliveryConsole/functions/merchant/MerchantActions'
import type {
  DeliveryConsolePageState as PageState,
  DeliveryConsolePageViewState as PageViewState,
  DeliveryConsoleSessionState as SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryConsoleScreenObjects'

function getMerchantProfileContext(pageView: PageViewState, pageState: PageState) {
  return {
    merchantProfile: pageView.merchantProfile,
    merchantProfileDraft: pageState.merchantProfileDraft,
    setMerchantProfileFormErrors: pageState.setMerchantProfileFormErrors,
  }
}

function getMerchantWithdrawContext(pageView: PageViewState, pageState: PageState) {
  return {
    merchantProfile: pageView.merchantProfile,
    merchantWithdrawAmount: pageState.merchantWithdrawAmount,
    setMerchantWithdrawAmount: pageState.setMerchantWithdrawAmount,
    setMerchantWithdrawFieldError: pageState.setMerchantWithdrawFieldError,
  }
}

function getMerchantOrderIssueContext(pageState: PageState) {
  return {
    partialRefundResolutionDrafts: pageState.partialRefundResolutionDrafts,
    setPartialRefundResolutionDrafts: pageState.setPartialRefundResolutionDrafts,
  }
}

export function getMerchantDraftContext(
  pageView: PageViewState,
  pageState: PageState,
) {
  return {
    ...getMerchantDraftDisplayContext(pageView, pageState),
    ...getMerchantDraftSetterContext(pageState),
  }
}

function getMerchantDraftDisplayContext(pageView: PageViewState, pageState: PageState) {
  return {
    currentDisplayName: pageView.currentDisplayName,
    isMerchantImageUploading: pageState.isMerchantImageUploading,
    menuComposerOpen: pageState.menuComposerOpen,
    menuItemDrafts: pageState.menuItemDrafts,
    menuItemImageUploading: pageState.menuItemImageUploading,
    merchantDraft: pageState.merchantDraft,
  }
}

function getMerchantDraftSetterContext(pageState: PageState) {
  return {
    setIsMerchantImageUploading: pageState.setIsMerchantImageUploading,
    setMenuComposerOpen: pageState.setMenuComposerOpen,
    setMenuItemDrafts: pageState.setMenuItemDrafts,
    setMenuItemFormErrors: pageState.setMenuItemFormErrors,
    setMenuItemImageUploading: pageState.setMenuItemImageUploading,
    setMerchantDraft: pageState.setMerchantDraft,
    setMerchantFormErrors: pageState.setMerchantFormErrors,
  }
}

export function getMerchantActionArgs(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
}) {
  const { pageView, pageState, sessionState } = args
  return {
    draft: getMerchantDraftContext(pageView, pageState),
    profile: getMerchantProfileContext(pageView, pageState),
    runAction: sessionState.runAction,
    setError: sessionState.setError,
    orderIssue: getMerchantOrderIssueContext(pageState),
    withdraw: getMerchantWithdrawContext(pageView, pageState),
  }
}

export function createMerchantConsoleActions(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
}) {
  return createMerchantActions(getMerchantActionArgs(args))
}
