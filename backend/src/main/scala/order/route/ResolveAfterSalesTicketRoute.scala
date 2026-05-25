package order.route

import order.api.*

import domain.shared.given

import admin.app.*
import cats.effect.IO
import domain.order.ResolveAfterSalesRequest
import domain.shared.{DeliveryAppState, TicketId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val resolveAfterSalesTicketRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(resolveAfterSalesTicketApi, req) =>
    val Some((matchedReq, ticketId)) = extractApi1(resolveAfterSalesTicketApi, req)
    withRole(matchedReq, UserRole.admin) { _ =>
      matchedReq.as[ResolveAfterSalesRequest].flatMap { payload =>
        resolveAfterSalesTicket(ticketId, payload).flatMap(handleStateResult)
      }
    }
}
