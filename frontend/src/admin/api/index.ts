import type {
  DeliveryAppState,
  EligibilityReviewId,
  MerchantApplicationId,
  OrderId,
  ResolveEligibilityReviewRequest,
  ResolveReviewAppealRequest,
  ResolveTicketRequest,
  ReviewAppealId,
  ReviewMerchantApplicationRequest,
} from '@/shared/object'
import { request } from '@/shared/api/http'
import { DELIVERY_API_ROUTE } from '@/shared/api/routes'

export function approveMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.merchantApplicationApprove(applicationId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function rejectMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.merchantApplicationReject(applicationId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolveReviewAppeal(
  appealId: ReviewAppealId,
  payload: ResolveReviewAppealRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.reviewAppealReview(appealId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolveEligibilityReview(
  reviewId: EligibilityReviewId,
  payload: ResolveEligibilityReviewRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.eligibilityReview(reviewId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolveTicket(orderId: OrderId, payload: ResolveTicketRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderResolve(orderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
