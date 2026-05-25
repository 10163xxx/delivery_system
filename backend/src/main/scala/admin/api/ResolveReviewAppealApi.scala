package admin.api

import domain.shared.given

import cats.effect.IO
import domain.review.ResolveReviewAppealRequest
import domain.shared.{DeliveryAppState, ReviewAppealId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import review.app.*
import shared.api.routing.*

val resolveReviewAppealApi: FixedMethodApi1[ReviewAppealId, DeliveryAppState] =
  jsonPostApi1[ReviewAppealId, ResolveReviewAppealRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("review-appeals")),
    List(routeSegment("review")),
  )
