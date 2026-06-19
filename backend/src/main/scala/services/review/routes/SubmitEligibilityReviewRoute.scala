package services.review.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.review.api.*

import system.objects.given

import cats.effect.IO
import services.review.objects.apiTypes.EligibilityReviewRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.merchant.objects.{StoreId}
import services.review.objects.{EligibilityReviewTarget}
import services.rider.objects.{RiderId}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.submitEligibilityReview
import system.api.*
import system.app.*

val submitEligibilityReviewRoute: HttpRoutes[IO] = apiRoute(submitEligibilityReviewApi) { matchedReq =>
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
