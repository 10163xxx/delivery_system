package order.route

import order.api.*

import domain.shared.given

import admin.app.*
import cats.effect.IO
import domain.order.SubmitPartialRefundRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val submitPartialRefundRequestRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(submitPartialRefundRequestApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(submitPartialRefundRequestApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden(RouteMessages.RefundOtherCustomerOrderForbidden)
      else
        matchedReq.as[SubmitPartialRefundRequest].flatMap { payload =>
          submitPartialRefundRequest(orderId, payload).flatMap(handleStateResult)
        }
    }
}
