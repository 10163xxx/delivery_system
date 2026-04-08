package http.delivery

import app.delivery.*
import cats.effect.IO
import domain.order.*
import domain.review.ReviewOrderRequest
import domain.shared.UserRole
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import http.support.*

val orderRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root / "api" / "delivery" / "orders" =>
      withRole(req, UserRole.customer) { user =>
        req.as[CreateOrderRequest].flatMap { payload =>
          if !ownsCustomer(payload.customerId, user.linkedProfileId) then Forbidden("无权为其他顾客下单")
          else createOrder(payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "accept" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden("无权处理其他商家的订单")
        else acceptOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "reject" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden("无权处理其他商家的订单")
        else
          req.as[RejectOrderRequest].flatMap { payload =>
            rejectOrder(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "ready" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden("无权处理其他商家的订单")
        else readyOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "assign-rider" =>
      withRole(req, UserRole.rider) { user =>
        req.as[AssignRiderRequest].flatMap { payload =>
          if !ownsRiderProfile(payload.riderId, user.linkedProfileId) then Forbidden("无权为其他骑手抢单")
          else assignRider(orderId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "pickup" =>
      withRole(req, UserRole.rider) { user =>
        if !ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden("无权处理其他骑手的订单")
        else pickupOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "deliver" =>
      withRole(req, UserRole.rider) { user =>
        if !ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden("无权处理其他骑手的订单")
        else deliverOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "review" =>
      withRole(req, UserRole.customer) { user =>
        if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden("无权评价其他顾客的订单")
        else
          req.as[ReviewOrderRequest].flatMap { payload =>
            reviewOrder(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "chat" =>
      withSession(req) { user =>
        val canChat =
          user.role match
            case UserRole.customer => ownsOrderAsCustomer(orderId, user.linkedProfileId)
            case UserRole.merchant => ownsOrderAsMerchant(orderId, user.displayName)
            case UserRole.rider => ownsOrderAsRider(orderId, user.linkedProfileId)
            case UserRole.admin => false

        if !canChat then Forbidden("无权参与该订单聊天")
        else
          val senderName =
            if user.role == UserRole.customer then
              user.linkedProfileId.map(customerAlias).getOrElse(user.displayName)
            else user.displayName
          req.as[SendOrderChatMessageRequest].flatMap { payload =>
            addOrderChatMessage(orderId, user.role, senderName, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "partial-refunds" =>
      withRole(req, UserRole.customer) { user =>
        if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden("无权申请其他顾客的退款")
        else
          req.as[SubmitPartialRefundRequest].flatMap { payload =>
            submitPartialRefundRequest(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "after-sales" =>
      withRole(req, UserRole.customer) { user =>
        if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden("无权提交其他顾客的售后申请")
        else
          req.as[SubmitAfterSalesRequest].flatMap { payload =>
            submitAfterSalesRequest(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "partial-refunds" / refundId / "review" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsPartialRefundRequestAsMerchant(refundId, user.displayName) then Forbidden("无权处理其他商家的退款申请")
        else
          req.as[ResolvePartialRefundRequest].flatMap { payload =>
            resolvePartialRefundRequest(refundId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "tickets" / ticketId / "after-sales" / "review" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ResolveAfterSalesRequest].flatMap { payload =>
          resolveAfterSalesTicket(ticketId, payload).flatMap(handleStateResult)
        }
      }
}
