package order.route

import order.api.*

import domain.shared.given

import cats.effect.IO
import domain.order.AppendStoreReviewReplyRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import order.app.appendStoreReviewReply
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val appendStoreReviewReplyRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(appendStoreReviewReplyApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(appendStoreReviewReplyApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
      else
        matchedReq.as[AppendStoreReviewReplyRequest].flatMap { payload =>
          appendStoreReviewReply(orderId, payload).flatMap(handleStateResult)
        }
    }
}
