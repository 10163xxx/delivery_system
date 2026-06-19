package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import services.admin.utils.*
import cats.effect.IO
import services.order.objects.apiTypes.ResolvePartialRefundRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.order.objects.{RefundRequestId}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val resolvePartialRefundRequestRoute: HttpRoutes[IO] = apiRoute(resolvePartialRefundRequestApi) { case (matchedReq, refundId) =>
  withRole(matchedReq, UserRole.merchant) { user =>
    if !ownsPartialRefundRequestAsMerchant(refundId, user.displayName) then Forbidden(RouteMessages.ResolveOtherMerchantRefundForbidden)
    else
      matchedReq.as[ResolvePartialRefundRequest].flatMap { payload =>
        resolvePartialRefundRequest(refundId, payload).flatMap(handleStateResult)
      }
  }
}
