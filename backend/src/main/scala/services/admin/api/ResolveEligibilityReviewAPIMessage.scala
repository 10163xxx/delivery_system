package services.admin.api

import domain.shared.given

import domain.review.ResolveEligibilityReviewRequest
import domain.shared.{DeliveryAppState, EligibilityReviewId}
import system.api.*

val resolveEligibilityReviewApi: FixedMethodApi[PathParam[EligibilityReviewId], DeliveryAppState] =
  jsonPostApi[EligibilityReviewId, ResolveEligibilityReviewRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("eligibility-reviews")),
    List(routeSegment("review")),
  )
