package services.admin.routes

import services.admin.api.*

import domain.shared.given

import cats.effect.IO
import domain.review.ResolveEligibilityReviewRequest
import domain.shared.{DeliveryAppState, EligibilityReviewId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.*
import system.api.*

val resolveEligibilityReviewRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(resolveEligibilityReviewApi, req) =>
    val (matchedReq, reviewId) = requireApi1(resolveEligibilityReviewApi, req)
    withRole(matchedReq, UserRole.admin) { _ =>
      matchedReq.as[ResolveEligibilityReviewRequest].flatMap { payload =>
        resolveEligibilityReview(reviewId, payload).flatMap(handleStateResult)
      }
    }
}
