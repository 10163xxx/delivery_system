import { BANK_OPTIONS } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { buildEligibilityReviewPayload, buildReviewAppealPayload } from '@/pages/AdminConsole/functions/payloads/DeliveryPayloadReviewAdmin'
import {
  assignRider,
  deliverOrder,
  pickupOrder,
  submitEligibilityReview,
  submitReviewAppeal,
  updateRiderAvailability,
  updateRiderProfile,
  withdrawRiderIncome,
} from '@/system/api/SharedApi'
import type { PageState, PageView, RiderPropsArgs, SessionService } from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'

export function getRiderUtilityProps() {
  return {
    BANK_OPTIONS,
    buildEligibilityReviewPayload,
    buildReviewAppealPayload,
  }
}

export function getRiderViewIdentityProps(pageView: PageView, sessionService: SessionService) {
  return {
    currentDisplayName: pageView.currentDisplayName,
    role: pageView.role,
    selectedRider: pageView.selectedRider,
    session: sessionService.session,
    statusLabels: pageView.statusLabels,
  }
}

export function getRiderViewOrderProps(pageView: PageView, pageState: PageState) {
  return {
    formatAggregateRating: pageView.formatAggregateRating,
    formatPrice: pageView.formatPrice,
    formatTime: pageView.formatTime,
    riderAvailableOrders: pageView.riderAvailableOrders,
    riderHistoryOrders: pageView.riderHistoryOrders,
    riderOrders: pageView.riderOrders,
    selectedRiderId: pageState.selectedRiderId,
  }
}

export function getRiderStateProps(pageState: PageState, sessionService: SessionService) {
  return {
    eligibilityReviewDrafts: pageState.eligibilityReviewDrafts,
    orderChatDrafts: pageState.orderChatDrafts,
    orderChatErrors: pageState.orderChatErrors,
    riderAppealDrafts: pageState.riderAppealDrafts,
    runAction: sessionService.runAction,
    state: sessionService.state,
  }
}

export function getRiderSetterProps(pageState: PageState) {
  return {
    setEligibilityReviewDrafts: pageState.setEligibilityReviewDrafts,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setRiderAppealDrafts: pageState.setRiderAppealDrafts,
    setSelectedRiderId: pageState.setSelectedRiderId,
  }
}

export function getRiderActionProps(submitOrderChatMessage: RiderPropsArgs['submitOrderChatMessage']) {
  return {
    submitOrderChatMessage,
    updateRiderAvailability,
    updateRiderProfile,
    withdrawRiderIncome,
    submitEligibilityReview,
    assignRider,
    pickupOrder,
    deliverOrder,
    submitReviewAppeal,
  }
}
