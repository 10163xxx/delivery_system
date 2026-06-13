import { buildAfterSalesResolutionPayload } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadMerchant'
import { buildAppealResolutionPayload, buildEligibilityReviewPayload, buildResolutionPayload, buildReviewApplicationPayload } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadReviewAdmin'
import {
  approveMerchantApplication,
  rejectMerchantApplication,
  resolveAfterSalesTicket,
  resolveEligibilityReview,
  resolveReviewAppeal,
  resolveTicket,
} from '@/system/api/SharedApi'
import type { PageState, PageView, SessionService } from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'

export function getAdminViewProps(pageView: PageView) {
  return {
    afterSalesTickets: pageView.afterSalesTickets,
    pendingAppeals: pageView.pendingAppeals,
    pendingApplications: pageView.pendingApplications,
    pendingEligibilityReviews: pageView.pendingEligibilityReviews,
  }
}

export function getAdminFormattingProps(pageView: PageView) {
  return {
    formatPrice: pageView.formatPrice,
    formatTime: pageView.formatTime,
  }
}

export function getAdminDraftStateProps(pageState: PageState, sessionService: SessionService) {
  return {
    afterSalesResolutionDrafts: pageState.afterSalesResolutionDrafts,
    appealResolutionDrafts: pageState.appealResolutionDrafts,
    applicationReviewDrafts: pageState.applicationReviewDrafts,
    eligibilityResolutionDrafts: pageState.eligibilityResolutionDrafts,
    resolutionDrafts: pageState.resolutionDrafts,
    runAction: sessionService.runAction,
    state: sessionService.state,
  }
}

export function getAdminSetterProps(pageState: PageState) {
  return {
    setAfterSalesResolutionDrafts: pageState.setAfterSalesResolutionDrafts,
    setAppealResolutionDrafts: pageState.setAppealResolutionDrafts,
    setApplicationReviewDrafts: pageState.setApplicationReviewDrafts,
    setEligibilityResolutionDrafts: pageState.setEligibilityResolutionDrafts,
    setResolutionDrafts: pageState.setResolutionDrafts,
  }
}

export function getAdminActionProps() {
  return {
    buildAfterSalesResolutionPayload,
    buildAppealResolutionPayload,
    buildResolutionPayload,
    buildReviewApplicationPayload,
    buildEligibilityReviewPayload,
    approveMerchantApplication,
    rejectMerchantApplication,
    resolveReviewAppeal,
    resolveEligibilityReview,
    resolveAfterSalesTicket,
    resolveTicket,
  }
}
