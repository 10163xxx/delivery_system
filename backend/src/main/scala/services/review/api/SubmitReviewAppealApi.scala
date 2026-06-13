package services.review.api

import domain.shared.given

import cats.effect.IO
import domain.review.ReviewAppealRequest
import domain.shared.{AppealRole, DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.submitReviewAppeal
import system.api.*
import system.app.*

val submitReviewAppealApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, ReviewAppealRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("review-appeals")),
  )
