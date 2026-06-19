package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import cats.effect.IO
import services.review.objects.apiTypes.ReviewOrderRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.order.objects.{OrderId}
import services.order.utils.reviewOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val reviewOrderRoute: HttpRoutes[IO] = apiRoute(reviewOrderApi) { case (matchedReq, orderId) =>
  withRole(matchedReq, UserRole.customer) { user =>
    if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden(RouteMessages.ReviewOtherCustomerOrderForbidden)
    else
      matchedReq.as[ReviewOrderRequest].flatMap { payload =>
        reviewOrder(orderId, payload).flatMap(handleStateResult)
      }
  }
}
