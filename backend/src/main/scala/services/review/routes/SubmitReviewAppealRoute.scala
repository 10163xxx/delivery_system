package services.review.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.review.api.*

import system.objects.given

import cats.effect.IO
import services.review.objects.apiTypes.ReviewAppealRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.order.objects.{OrderId}
import services.review.objects.{AppealRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.submitReviewAppeal
import system.api.*
import system.app.*

val submitReviewAppealRoute: HttpRoutes[IO] = apiRoute(submitReviewAppealApi) { case (matchedReq, orderId) =>
  withSession(matchedReq) { user =>
    matchedReq.as[ReviewAppealRequest].flatMap { payload =>
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
}
