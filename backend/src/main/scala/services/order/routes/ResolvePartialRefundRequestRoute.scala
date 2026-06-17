package services.order.routes

import services.order.api.*

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.ResolvePartialRefundRequest
import domain.shared.{DeliveryAppState, RefundRequestId, UserRole}
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
