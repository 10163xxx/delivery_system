package services.review.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.review.objects.apiTypes.ReviewAppealRequest
import system.app.objects.{DeliveryAppState}
import services.order.objects.{OrderId}
import services.review.objects.{AppealRole}
import system.api.*

val submitReviewAppealApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, ReviewAppealRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("review-appeals")),
  )
