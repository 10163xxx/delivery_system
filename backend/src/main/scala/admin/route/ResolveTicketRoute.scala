package admin.route

import admin.api.*

import domain.shared.given

import cats.effect.IO
import domain.admin.ResolveTicketRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import review.app.*
import shared.api.routing.*

val resolveTicketRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(resolveTicketApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(resolveTicketApi, req)
    withRole(matchedReq, UserRole.admin) { _ =>
      matchedReq.as[ResolveTicketRequest].flatMap { payload =>
        resolveTicket(orderId, payload).flatMap(handleStateResult)
      }
    }
}
