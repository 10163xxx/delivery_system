package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import services.admin.utils.*
import cats.effect.IO
import services.order.objects.apiTypes.SendOrderChatMessageRequest
import system.objects.{ApprovalFlag}
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.customer.objects.{CustomerId}
import services.order.objects.{OrderId}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val sendOrderChatMessageRoute: HttpRoutes[IO] = apiRoute(sendOrderChatMessageApi) { case (matchedReq, orderId) =>
  withSession(matchedReq) { user =>
    val canChat: ApprovalFlag =
      user.role match
        case UserRole.customer => ownsOrderAsCustomer(orderId, user.linkedProfileId)
        case UserRole.merchant => ownsOrderAsMerchant(orderId, user.displayName)
        case UserRole.rider => ownsOrderAsRider(orderId, user.linkedProfileId)
        case UserRole.admin => new ApprovalFlag(false)

    if !canChat.raw then Forbidden(RouteMessages.JoinOtherOrderChatForbidden)
    else
      val senderName =
        if user.role == UserRole.customer then
          user.linkedProfileId.map(profileId => customerAlias(new CustomerId(profileId.raw))).getOrElse(user.displayName)
        else user.displayName
      matchedReq.as[SendOrderChatMessageRequest].flatMap { payload =>
        addOrderChatMessage(orderId, user.role, senderName, payload).flatMap(handleStateResult)
      }
  }
}
