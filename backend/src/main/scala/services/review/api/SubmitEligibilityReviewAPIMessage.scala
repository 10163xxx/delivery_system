package services.review.api

import domain.shared.given

import domain.review.EligibilityReviewRequest
import domain.shared.{DeliveryAppState, EligibilityReviewTarget, RiderId, StoreId}
import system.api.*

val submitEligibilityReviewApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[EligibilityReviewRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("eligibility-reviews"),
  )
