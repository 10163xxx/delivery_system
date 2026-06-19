package services.review.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.review.objects.apiTypes.EligibilityReviewRequest
import system.app.objects.{DeliveryAppState}
import services.merchant.objects.{StoreId}
import services.review.objects.{EligibilityReviewTarget}
import services.rider.objects.{RiderId}
import system.api.*

val submitEligibilityReviewApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[EligibilityReviewRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("eligibility-reviews"),
  )
