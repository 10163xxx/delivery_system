import type {
  DeliveryAppState,
  EligibilityReviewRequest,
  OrderId,
  ReviewAppealRequest,
} from '@/shared/object/core/SharedObjects'
import {
  defineJsonPostEndpoint,
  httpClient,
} from '@/shared/api/SharedHttpClient'
import { normalizeDeliveryState } from '@/shared/api/DeliveryStateNormalizer'
import {
  DELIVERY_ELIGIBILITY_REVIEWS_API_ROUTE,
  getOrderReviewAppealsApiRoute,
} from '@/shared/api/ApiRoutes'

export const reviewApi = {
  submitReviewAppeal(orderId: OrderId, payload: ReviewAppealRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ReviewAppealRequest, DeliveryAppState>(
        getOrderReviewAppealsApiRoute(orderId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  submitEligibilityReview(payload: EligibilityReviewRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<EligibilityReviewRequest, DeliveryAppState>(
        DELIVERY_ELIGIBILITY_REVIEWS_API_ROUTE,
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
}

export const { submitReviewAppeal, submitEligibilityReview } = reviewApi
