package services.order.api

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.ResolveAfterSalesRequest
import domain.shared.{DeliveryAppState, TicketId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val resolveAfterSalesTicketApi: FixedMethodApi1[TicketId, DeliveryAppState] =
  jsonPostApi1[TicketId, ResolveAfterSalesRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("tickets")),
    List(routeSegment("afterSales"), routeSegment("review")),
  )
