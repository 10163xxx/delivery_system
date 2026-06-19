package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import services.admin.utils.*
import cats.effect.IO
import services.order.objects.apiTypes.SubmitAfterSalesRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.order.objects.{OrderId}
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
