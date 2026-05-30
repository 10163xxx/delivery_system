package order.api

import domain.shared.given

import admin.app.*
import cats.effect.IO
import domain.order.ResolveAfterSalesRequest
import domain.shared.{DeliveryAppState, TicketId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val resolveAfterSalesTicketApi: FixedMethodApi1[TicketId, DeliveryAppState] =
  jsonPostApi1[TicketId, ResolveAfterSalesRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("tickets")),
    List(routeSegment("afterSales"), routeSegment("review")),
  )
