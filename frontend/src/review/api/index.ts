import type {
  DeliveryAppState,
  EligibilityReviewRequest,
  OrderId,
  ReviewAppealRequest,
} from '@/shared/object'
import { request } from '@/shared/api/http'
import { DELIVERY_API_ROUTE } from '@/shared/api/routes'

export function submitReviewAppeal(orderId: OrderId, payload: ReviewAppealRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderReviewAppeals(orderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitEligibilityReview(payload: EligibilityReviewRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.eligibilityReviews, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
