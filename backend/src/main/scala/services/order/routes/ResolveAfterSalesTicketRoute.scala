package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import services.admin.utils.*
import cats.effect.IO
import services.order.objects.apiTypes.ResolveAfterSalesRequest
import system.app.objects.{DeliveryAppState}
import services.admin.objects.{TicketId}
import services.auth.objects.{UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val resolveAfterSalesTicketRoute: HttpRoutes[IO] = apiRoute(resolveAfterSalesTicketApi) { case (matchedReq, ticketId) =>
  withRole(matchedReq, UserRole.admin) { _ =>
    matchedReq.as[ResolveAfterSalesRequest].flatMap { payload =>
      resolveAfterSalesTicket(ticketId, payload).flatMap(handleStateResult)
    }
  }
}
