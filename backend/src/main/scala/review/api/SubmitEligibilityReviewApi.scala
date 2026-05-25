package review.api

import domain.shared.given

import cats.effect.IO
import domain.review.EligibilityReviewRequest
import domain.shared.{DeliveryAppState, EligibilityReviewTarget, RiderId, StoreId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import review.app.submitEligibilityReview
import shared.api.routing.*
import shared.app.*

val submitEligibilityReviewApi: FixedMethodApi0[DeliveryAppState] =
  jsonPostApi0[EligibilityReviewRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("eligibility-reviews"),
  )
