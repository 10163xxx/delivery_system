package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import cats.effect.IO
import services.order.objects.apiTypes.RejectOrderRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.order.objects.{OrderId}
import services.order.utils.rejectOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val rejectOrderRoute: HttpRoutes[IO] = apiRoute(rejectOrderApi) { case (matchedReq, orderId) =>
  withRole(matchedReq, UserRole.merchant) { user =>
    if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
    else
      matchedReq.as[RejectOrderRequest].flatMap { payload =>
        rejectOrder(orderId, payload).flatMap(handleStateResult)
      }
  }
}
