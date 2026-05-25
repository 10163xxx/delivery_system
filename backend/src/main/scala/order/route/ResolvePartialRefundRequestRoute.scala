package order.route

import order.api.*

import domain.shared.given

import admin.app.*
import cats.effect.IO
import domain.order.ResolvePartialRefundRequest
import domain.shared.{DeliveryAppState, RefundRequestId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val resolvePartialRefundRequestRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(resolvePartialRefundRequestApi, req) =>
    val Some((matchedReq, refundId)) = extractApi1(resolvePartialRefundRequestApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsPartialRefundRequestAsMerchant(refundId, user.displayName) then Forbidden(RouteMessages.ResolveOtherMerchantRefundForbidden)
      else
        matchedReq.as[ResolvePartialRefundRequest].flatMap { payload =>
          resolvePartialRefundRequest(refundId, payload).flatMap(handleStateResult)
        }
    }
}
