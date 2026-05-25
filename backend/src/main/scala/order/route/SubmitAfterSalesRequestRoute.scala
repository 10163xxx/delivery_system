package order.route

import order.api.*

import domain.shared.given

import admin.app.*
import cats.effect.IO
import domain.order.SubmitAfterSalesRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val submitAfterSalesRequestRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(submitAfterSalesRequestApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(submitAfterSalesRequestApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden(RouteMessages.SubmitOtherCustomerAfterSalesForbidden)
      else
        matchedReq.as[SubmitAfterSalesRequest].flatMap { payload =>
          submitAfterSalesRequest(orderId, payload).flatMap(handleStateResult)
        }
    }
}
