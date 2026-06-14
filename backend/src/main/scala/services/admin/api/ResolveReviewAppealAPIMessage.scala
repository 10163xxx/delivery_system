package services.admin.api

import domain.shared.given

import cats.effect.IO
import domain.review.ResolveReviewAppealRequest
import domain.shared.{DeliveryAppState, ReviewAppealId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.*
import system.api.*

val resolveReviewAppealApi: FixedMethodApi1[ReviewAppealId, DeliveryAppState] =
  jsonPostApi1[ReviewAppealId, ResolveReviewAppealRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("review-appeals")),
    List(routeSegment("review")),
  )
