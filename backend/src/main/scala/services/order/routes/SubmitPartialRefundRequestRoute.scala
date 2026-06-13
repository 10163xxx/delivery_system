package services.order.routes

import services.order.api.*

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.SubmitPartialRefundRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

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
