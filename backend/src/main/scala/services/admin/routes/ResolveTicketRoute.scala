package services.admin.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.admin.api.*

import system.objects.given

import cats.effect.IO
import services.admin.objects.apiTypes.ResolveTicketRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.order.objects.{OrderId}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.*
import system.api.*

val resolveTicketRoute: HttpRoutes[IO] = apiRoute(resolveTicketApi) { case (matchedReq, orderId) =>
  withRole(matchedReq, UserRole.admin) { _ =>
    matchedReq.as[ResolveTicketRequest].flatMap { payload =>
      resolveTicket(orderId, payload).flatMap(handleStateResult)
    }
  }
}
