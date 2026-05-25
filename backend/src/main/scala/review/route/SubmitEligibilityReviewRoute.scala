package review.route

import review.api.*

import domain.shared.given

import cats.effect.IO
import domain.review.EligibilityReviewRequest
import domain.shared.{DeliveryAppState, EligibilityReviewTarget, RiderId, StoreId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import review.app.submitEligibilityReview
import shared.api.routing.*
import shared.app.*

val submitEligibilityReviewRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(submitEligibilityReviewApi, req) =>
    val Some(matchedReq) = extractApi0(submitEligibilityReviewApi, req)
    withSession(matchedReq) { user =>
      matchedReq.as[EligibilityReviewRequest].flatMap { payload =>
        val allowed =
          payload.target match
            case EligibilityReviewTarget.Store =>
              user.role == UserRole.merchant && ownsStore(new StoreId(payload.targetId.raw), user.displayName)
            case EligibilityReviewTarget.Rider =>
              user.role == UserRole.rider && ownsRiderProfile(new RiderId(payload.targetId.raw), user.linkedProfileId)
        if !allowed then Forbidden(RouteMessages.SubmitEligibilityReviewForbidden)
        else submitEligibilityReview(payload).flatMap(handleStateResult)
      }
    }
}
