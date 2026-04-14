import { BANK_OPTIONS, buildEligibilityReviewPayload, buildReviewAppealPayload } from '@/shared/delivery'
import {
  assignRider,
  deliverOrder,
  pickupOrder,
  submitEligibilityReview,
  submitReviewAppeal,
  updateRiderProfile,
  withdrawRiderIncome,
} from '@/shared/api'
import type { PageState, PageView, RiderPropsArgs, SessionService } from './types'

function getRiderViewProps(pageView: PageView, pageState: PageState, sessionService: SessionService) {
  return {
    BANK_OPTIONS,
    buildEligibilityReviewPayload,
    buildReviewAppealPayload,
    currentDisplayName: pageView.currentDisplayName,
    eligibilityReviewDrafts: pageState.eligibilityReviewDrafts,
    formatAggregateRating: pageView.formatAggregateRating,
    formatPrice: pageView.formatPrice,
    formatTime: pageView.formatTime,
    riderOrders: pageView.riderOrders,
    role: pageView.role,
    selectedRider: pageView.selectedRider,
    selectedRiderId: pageState.selectedRiderId,
    session: sessionService.session,
    statusLabels: pageView.statusLabels,
  }
}

function getRiderStateProps(pageState: PageState, sessionService: SessionService) {
  return {
    orderChatDrafts: pageState.orderChatDrafts,
    orderChatErrors: pageState.orderChatErrors,
    riderAppealDrafts: pageState.riderAppealDrafts,
    runAction: sessionService.runAction,
    setEligibilityReviewDrafts: pageState.setEligibilityReviewDrafts,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setRiderAppealDrafts: pageState.setRiderAppealDrafts,
    setSelectedRiderId: pageState.setSelectedRiderId,
    state: sessionService.state,
  }
}

function getRiderActionProps(submitOrderChatMessage: RiderPropsArgs['submitOrderChatMessage']) {
  return {
    submitOrderChatMessage,
    updateRiderProfile,
    withdrawRiderIncome,
    submitEligibilityReview,
    assignRider,
    pickupOrder,
    deliverOrder,
    submitReviewAppeal,
  }
}

export function buildRiderProps({
  pageView,
  pageState,
  sessionService,
  submitOrderChatMessage,
}: RiderPropsArgs) {
  return {
    ...getRiderViewProps(pageView, pageState, sessionService),
    ...getRiderStateProps(pageState, sessionService),
    ...getRiderActionProps(submitOrderChatMessage),
  }
}
