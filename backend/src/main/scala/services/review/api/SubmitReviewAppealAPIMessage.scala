package services.review.api

import domain.shared.given

import domain.review.ReviewAppealRequest
import domain.shared.{AppealRole, DeliveryAppState, OrderId}
import system.api.*

val submitReviewAppealApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, ReviewAppealRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("review-appeals")),
  )
