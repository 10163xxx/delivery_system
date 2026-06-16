package services.order.routes

import services.order.api.*

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.SendOrderChatMessageRequest
import domain.shared.{ApprovalFlag, CustomerId, DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val sendOrderChatMessageRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(sendOrderChatMessageApi, req) =>
    val (matchedReq, orderId) = requireApi1(sendOrderChatMessageApi, req)
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
