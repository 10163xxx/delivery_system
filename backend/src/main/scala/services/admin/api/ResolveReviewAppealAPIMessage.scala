package services.admin.api

import domain.shared.given

import domain.review.ResolveReviewAppealRequest
import domain.shared.{DeliveryAppState, ReviewAppealId}
import system.api.*

val resolveReviewAppealApi: FixedMethodApi[PathParam[ReviewAppealId], DeliveryAppState] =
  jsonPostApi[ReviewAppealId, ResolveReviewAppealRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("review-appeals")),
    List(routeSegment("review")),
  )
