package services.order.routes

import services.order.api.*

import domain.shared.given

import cats.effect.IO
import domain.order.CreateOrderRequest
import domain.shared.{DeliveryAppState, UserRole}
import services.order.utils.createOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val createOrderRoute: HttpRoutes[IO] = apiRoute(createOrderApi) { matchedReq =>
  withRole(matchedReq, UserRole.customer) { user =>
    matchedReq.as[CreateOrderRequest].flatMap { payload =>
      if !ownsCustomer(payload.customerId, user.linkedProfileId) then Forbidden(RouteMessages.CreateOtherCustomerOrderForbidden)
      else createOrder(payload).flatMap(handleStateResult)
    }
  }
}
