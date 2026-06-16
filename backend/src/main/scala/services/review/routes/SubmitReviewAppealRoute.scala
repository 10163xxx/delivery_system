package services.review.routes

import services.review.api.*

import domain.shared.given

import cats.effect.IO
import domain.review.ReviewAppealRequest
import domain.shared.{AppealRole, DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.submitReviewAppeal
import system.api.*
import system.app.*

val submitReviewAppealRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(submitReviewAppealApi, req) =>
    val (matchedReq, orderId) = requireApi1(submitReviewAppealApi, req)
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
