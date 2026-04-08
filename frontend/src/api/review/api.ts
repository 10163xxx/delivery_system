import type {
  DeliveryAppState,
  EligibilityReviewRequest,
  EligibilityReviewId,
  OrderId,
  ResolveEligibilityReviewRequest,
  ResolveReviewAppealRequest,
  ResolveTicketRequest,
  ReviewAppealId,
  ReviewAppealRequest,
} from '@/domain'
import { request } from '@/api/shared/http'

export function submitReviewAppeal(orderId: OrderId, payload: ReviewAppealRequest) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/review-appeals`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolveReviewAppeal(
  appealId: ReviewAppealId,
  payload: ResolveReviewAppealRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/review-appeals/${appealId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitEligibilityReview(payload: EligibilityReviewRequest) {
  return request<DeliveryAppState>('/api/delivery/eligibility-reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolveEligibilityReview(
  reviewId: EligibilityReviewId,
  payload: ResolveEligibilityReviewRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/eligibility-reviews/${reviewId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolveTicket(orderId: OrderId, payload: ResolveTicketRequest) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/resolve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
