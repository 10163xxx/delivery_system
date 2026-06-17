package services.order.routes

import services.order.api.*

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.SubmitAfterSalesRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val submitAfterSalesRequestRoute: HttpRoutes[IO] = apiRoute(submitAfterSalesRequestApi) { case (matchedReq, orderId) =>
  withRole(matchedReq, UserRole.customer) { user =>
    if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden(RouteMessages.SubmitOtherCustomerAfterSalesForbidden)
    else
      matchedReq.as[SubmitAfterSalesRequest].flatMap { payload =>
        submitAfterSalesRequest(orderId, payload).flatMap(handleStateResult)
      }
  }
}
