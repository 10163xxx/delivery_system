package services.admin.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.review.objects.apiTypes.ResolveReviewAppealRequest
import system.app.objects.{DeliveryAppState}
import services.review.objects.{ReviewAppealId}
import system.api.*

val resolveReviewAppealApi: FixedMethodApi[PathParam[ReviewAppealId], DeliveryAppState] =
  jsonPostApi[ReviewAppealId, ResolveReviewAppealRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("review-appeals")),
    List(routeSegment("review")),
  )
