package services.admin.routes

import services.admin.api.*

import domain.shared.given

import cats.effect.IO
import domain.admin.ResolveTicketRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.*
import system.api.*

val resolveTicketRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(resolveTicketApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(resolveTicketApi, req)
    withRole(matchedReq, UserRole.admin) { _ =>
      matchedReq.as[ResolveTicketRequest].flatMap { payload =>
        resolveTicket(orderId, payload).flatMap(handleStateResult)
      }
    }
}
