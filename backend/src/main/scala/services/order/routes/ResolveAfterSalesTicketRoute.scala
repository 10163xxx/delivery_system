package services.order.routes

import services.order.api.*

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.ResolveAfterSalesRequest
import domain.shared.{DeliveryAppState, TicketId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val resolveAfterSalesTicketRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(resolveAfterSalesTicketApi, req) =>
    val (matchedReq, ticketId) = requireApi1(resolveAfterSalesTicketApi, req)
    withRole(matchedReq, UserRole.admin) { _ =>
      matchedReq.as[ResolveAfterSalesRequest].flatMap { payload =>
        resolveAfterSalesTicket(ticketId, payload).flatMap(handleStateResult)
      }
    }
}
