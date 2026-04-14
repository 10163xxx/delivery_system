package api.delivery

import domain.shared.given

import app.delivery.*
import cats.effect.IO
import domain.order.*
import domain.review.ReviewOrderRequest
import domain.shared.{ApprovalFlag, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import api.support.*

val orderRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root / "api" / "delivery" / "orders" =>
      withRole(req, UserRole.customer) { user =>
        req.as[CreateOrderRequest].flatMap { payload =>
          if !ownsCustomer(payload.customerId, user.linkedProfileId) then Forbidden(RouteMessages.CreateOtherCustomerOrderForbidden)
          else createOrder(payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "accept" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
        else acceptOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "reject" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
        else
          req.as[RejectOrderRequest].flatMap { payload =>
            rejectOrder(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "ready" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
        else readyOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "assign-rider" =>
      withRole(req, UserRole.rider) { user =>
        req.as[AssignRiderRequest].flatMap { payload =>
          if !ownsRiderProfile(payload.riderId, user.linkedProfileId) then Forbidden(RouteMessages.ClaimOtherRiderOrderForbidden)
          else assignRider(orderId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "pickup" =>
      withRole(req, UserRole.rider) { user =>
        if !ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden(RouteMessages.HandleOtherRiderOrderForbidden)
        else pickupOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "deliver" =>
      withRole(req, UserRole.rider) { user =>
        if !ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden(RouteMessages.HandleOtherRiderOrderForbidden)
        else deliverOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "review" =>
      withRole(req, UserRole.customer) { user =>
        if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden(RouteMessages.ReviewOtherCustomerOrderForbidden)
        else
          req.as[ReviewOrderRequest].flatMap { payload =>
            reviewOrder(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "chat" =>
      withSession(req) { user =>
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
              user.linkedProfileId.map(customerAlias).getOrElse(user.displayName)
            else user.displayName
          req.as[SendOrderChatMessageRequest].flatMap { payload =>
            addOrderChatMessage(orderId, user.role, senderName, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "partial-refunds" =>
      withRole(req, UserRole.customer) { user =>
        if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden(RouteMessages.RefundOtherCustomerOrderForbidden)
        else
          req.as[SubmitPartialRefundRequest].flatMap { payload =>
            submitPartialRefundRequest(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "after-sales" =>
      withRole(req, UserRole.customer) { user =>
        if !ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden(RouteMessages.SubmitOtherCustomerAfterSalesForbidden)
        else
          req.as[SubmitAfterSalesRequest].flatMap { payload =>
            submitAfterSalesRequest(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "partial-refunds" / refundId / "review" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsPartialRefundRequestAsMerchant(refundId, user.displayName) then Forbidden(RouteMessages.ResolveOtherMerchantRefundForbidden)
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
