package services.order.routes

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val orderRoutes: HttpRoutes[IO] =
  createOrderRoute <+>
    acceptOrderRoute <+>
    rejectOrderRoute <+>
    readyOrderRoute <+>
    assignRiderRoute <+>
    pickupOrderRoute <+>
    deliverOrderRoute <+>
    reviewOrderRoute <+>
    appendStoreReviewReplyRoute <+>
    sendOrderChatMessageRoute <+>
    submitPartialRefundRequestRoute <+>
    submitAfterSalesRequestRoute <+>
    resolvePartialRefundRequestRoute <+>
    resolveAfterSalesTicketRoute
