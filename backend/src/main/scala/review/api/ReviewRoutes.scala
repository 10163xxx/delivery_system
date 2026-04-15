package review.api

import domain.shared.given

import shared.app.*
import review.app.*
import cats.effect.IO
import domain.review.*
import domain.shared.{AppealRole, EligibilityReviewTarget, UserRole}
import shared.api.support.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*

val reviewRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "review-appeals" =>
    withSession(req) { user =>
      req.as[ReviewAppealRequest].flatMap { payload =>
        val allowed =
          payload.appellantRole match
            case AppealRole.Merchant =>
              user.role == UserRole.merchant && ownsOrderAsMerchant(orderId, user.displayName)
            case AppealRole.Rider =>
              user.role == UserRole.rider && ownsOrderAsRider(orderId, user.linkedProfileId)
        if !allowed then Forbidden(RouteMessages.SubmitReviewAppealForbidden)
        else submitReviewAppeal(orderId, payload).flatMap(handleStateResult)
      }
    }

  case req @ POST -> Root / "api" / "delivery" / "eligibility-reviews" =>
    withSession(req) { user =>
      req.as[EligibilityReviewRequest].flatMap { payload =>
        val allowed =
          payload.target match
            case EligibilityReviewTarget.Store =>
              user.role == UserRole.merchant && ownsStore(payload.targetId, user.displayName)
            case EligibilityReviewTarget.Rider =>
              user.role == UserRole.rider && ownsRiderProfile(payload.targetId, user.linkedProfileId)
        if !allowed then Forbidden(RouteMessages.SubmitEligibilityReviewForbidden)
        else submitEligibilityReview(payload).flatMap(handleStateResult)
      }
    }
}
