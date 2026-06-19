package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import cats.effect.IO
import services.order.objects.apiTypes.AppendStoreReviewReplyRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.order.objects.{OrderId}
import services.order.utils.appendStoreReviewReply
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val appendStoreReviewReplyRoute: HttpRoutes[IO] = apiRoute(appendStoreReviewReplyApi) { case (matchedReq, orderId) =>
  withRole(matchedReq, UserRole.merchant) { user =>
    if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
    else
      matchedReq.as[AppendStoreReviewReplyRequest].flatMap { payload =>
        appendStoreReviewReply(orderId, payload).flatMap(handleStateResult)
      }
  }
}
