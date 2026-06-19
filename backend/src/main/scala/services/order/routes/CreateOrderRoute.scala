package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import cats.effect.IO
import services.order.objects.apiTypes.CreateOrderRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
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
