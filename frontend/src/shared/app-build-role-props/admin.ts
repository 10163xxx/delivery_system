import {
  buildAfterSalesResolutionPayload,
  buildAppealResolutionPayload,
  buildEligibilityReviewPayload,
  buildResolutionPayload,
  buildReviewApplicationPayload,
} from '@/shared/delivery'
import {
  approveMerchantApplication,
  rejectMerchantApplication,
  resolveAfterSalesTicket,
  resolveEligibilityReview,
  resolveReviewAppeal,
  resolveTicket,
} from '@/shared/api'
import type { AdminPropsArgs, PageState, PageView, SessionService } from './types'

function getAdminViewProps(pageView: PageView) {
  return {
    afterSalesTickets: pageView.afterSalesTickets,
    formatPrice: pageView.formatPrice,
    formatTime: pageView.formatTime,
    pendingAppeals: pageView.pendingAppeals,
    pendingApplications: pageView.pendingApplications,
    pendingEligibilityReviews: pageView.pendingEligibilityReviews,
  }
}

function getAdminStateProps(pageState: PageState, sessionService: SessionService) {
  return {
    afterSalesResolutionDrafts: pageState.afterSalesResolutionDrafts,
    appealResolutionDrafts: pageState.appealResolutionDrafts,
    applicationReviewDrafts: pageState.applicationReviewDrafts,
    eligibilityResolutionDrafts: pageState.eligibilityResolutionDrafts,
    resolutionDrafts: pageState.resolutionDrafts,
    runAction: sessionService.runAction,
    setAfterSalesResolutionDrafts: pageState.setAfterSalesResolutionDrafts,
    setAppealResolutionDrafts: pageState.setAppealResolutionDrafts,
    setApplicationReviewDrafts: pageState.setApplicationReviewDrafts,
    setEligibilityResolutionDrafts: pageState.setEligibilityResolutionDrafts,
    setResolutionDrafts: pageState.setResolutionDrafts,
    state: sessionService.state,
  }
}

function getAdminActionProps() {
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

export function buildAdminProps({ pageView, pageState, sessionService }: AdminPropsArgs) {
  return {
    ...getAdminViewProps(pageView),
    ...getAdminStateProps(pageState, sessionService),
    ...getAdminActionProps(),
  }
}
