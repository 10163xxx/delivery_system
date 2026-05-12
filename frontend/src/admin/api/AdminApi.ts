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
} from '@/shared/object/core/SharedObjects'
import {
  defineJsonPostEndpoint,
  httpClient,
} from '@/shared/api/SharedHttpClient'
import { normalizeDeliveryState } from '@/shared/api/DeliveryStateNormalizer'
import {
  getEligibilityReviewApiRoute,
  getMerchantApplicationApproveApiRoute,
  getMerchantApplicationRejectApiRoute,
  getOrderResolveApiRoute,
  getReviewAppealReviewApiRoute,
} from '@/shared/api/ApiRoutes'

export const adminApi = {
  approveMerchantApplication(
    applicationId: MerchantApplicationId,
    payload: ReviewMerchantApplicationRequest,
  ) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ReviewMerchantApplicationRequest, DeliveryAppState>(
        getMerchantApplicationApproveApiRoute(applicationId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  rejectMerchantApplication(
    applicationId: MerchantApplicationId,
    payload: ReviewMerchantApplicationRequest,
  ) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ReviewMerchantApplicationRequest, DeliveryAppState>(
        getMerchantApplicationRejectApiRoute(applicationId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  resolveReviewAppeal(appealId: ReviewAppealId, payload: ResolveReviewAppealRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ResolveReviewAppealRequest, DeliveryAppState>(
        getReviewAppealReviewApiRoute(appealId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  resolveEligibilityReview(
    reviewId: EligibilityReviewId,
    payload: ResolveEligibilityReviewRequest,
  ) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ResolveEligibilityReviewRequest, DeliveryAppState>(
        getEligibilityReviewApiRoute(reviewId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  resolveTicket(orderId: OrderId, payload: ResolveTicketRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ResolveTicketRequest, DeliveryAppState>(
        getOrderResolveApiRoute(orderId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
}

export const {
  approveMerchantApplication,
  rejectMerchantApplication,
  resolveReviewAppeal,
  resolveEligibilityReview,
  resolveTicket,
} = adminApi
