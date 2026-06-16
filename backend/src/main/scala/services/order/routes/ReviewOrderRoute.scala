package services.order.routes

import services.order.api.*

import domain.shared.given

import cats.effect.IO
import domain.review.ReviewOrderRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import services.order.utils.reviewOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val reviewOrderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(reviewOrderApi, req) =>
    val (matchedReq, orderId) = requireApi1(reviewOrderApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden(RouteMessages.ReviewOtherCustomerOrderForbidden)
      else
        matchedReq.as[ReviewOrderRequest].flatMap { payload =>
          reviewOrder(orderId, payload).flatMap(handleStateResult)
        }
    }
}
