package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import system.objects.given

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
