package admin.api

import domain.shared.given

import cats.effect.IO
import domain.review.ResolveEligibilityReviewRequest
import domain.shared.{DeliveryAppState, EligibilityReviewId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import review.app.*
import shared.api.routing.*

val resolveEligibilityReviewApi: FixedMethodApi1[EligibilityReviewId, DeliveryAppState] =
  jsonPostApi1[EligibilityReviewId, ResolveEligibilityReviewRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("eligibility-reviews")),
    List(routeSegment("review")),
  )
