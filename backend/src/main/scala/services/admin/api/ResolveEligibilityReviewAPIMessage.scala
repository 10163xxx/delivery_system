package services.admin.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.review.objects.apiTypes.ResolveEligibilityReviewRequest
import system.app.objects.{DeliveryAppState}
import services.review.objects.{EligibilityReviewId}
import system.api.*

val resolveEligibilityReviewApi: FixedMethodApi[PathParam[EligibilityReviewId], DeliveryAppState] =
  jsonPostApi[EligibilityReviewId, ResolveEligibilityReviewRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("eligibility-reviews")),
    List(routeSegment("review")),
  )
