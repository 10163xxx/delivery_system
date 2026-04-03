package routes

import cats.effect.IO
import fs2.io.file.Path as Fs2Path
import io.circe.syntax.*
import objects.*
import org.http4s.HttpRoutes
import org.http4s.Request
import org.http4s.Response
import org.http4s.Status
import org.http4s.StaticFile
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.http4s.headers.`Content-Type`
import org.http4s.multipart.Multipart
import org.typelevel.ci.CIString
import state.AuthRepo
import state.DeliveryStateRepo
import state.ImageStorageRepo

object DeliveryRouter:

  val routes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ GET -> Root / "api" / "delivery" / "state" =>
      withSession(req) { _ =>
        DeliveryStateRepo.getState.flatMap(state => Ok(state.asJson))
      }

    case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "profile" =>
      withRole(req, UserRole.customer) { user =>
        if !DeliveryStateRepo.ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权修改其他顾客资料")
        else
          req.as[UpdateCustomerProfileRequest].flatMap { payload =>
            DeliveryStateRepo.updateCustomerProfile(customerId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" =>
      withRole(req, UserRole.customer) { user =>
        if !DeliveryStateRepo.ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权修改其他顾客地址")
        else
          req.as[AddCustomerAddressRequest].flatMap { payload =>
            DeliveryStateRepo.addCustomerAddress(customerId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" / "remove" =>
      withRole(req, UserRole.customer) { user =>
        if !DeliveryStateRepo.ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权修改其他顾客地址")
        else
          req.as[RemoveCustomerAddressRequest].flatMap { payload =>
            DeliveryStateRepo.removeCustomerAddress(customerId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" / "default" =>
      withRole(req, UserRole.customer) { user =>
        if !DeliveryStateRepo.ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权修改其他顾客地址")
        else
          req.as[SetDefaultCustomerAddressRequest].flatMap { payload =>
            DeliveryStateRepo.setDefaultCustomerAddress(customerId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "recharge" =>
      withRole(req, UserRole.customer) { user =>
        if !DeliveryStateRepo.ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权为其他顾客充值")
        else
          req.as[RechargeBalanceRequest].flatMap { payload =>
            DeliveryStateRepo.rechargeCustomerBalance(customerId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "merchant-applications" =>
      withRole(req, UserRole.merchant) { user =>
        req.as[MerchantRegistrationRequest].flatMap { payload =>
          DeliveryStateRepo
            .submitMerchantApplication(payload.copy(merchantName = user.displayName))
            .flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "uploads" / "store-image" =>
      withRole(req, UserRole.merchant) { _ =>
        req.as[Multipart[IO]].flatMap { multipart =>
          multipart.parts.find(_.name.contains("file")) match
            case Some(filePart) =>
              filePart.body.compile.to(Array).flatMap { bytes =>
                val mediaType = filePart.headers.get[`Content-Type`].map(_.mediaType.toString)
                ImageStorageRepo
                  .saveStoreImage(filePart.filename, mediaType, bytes)
                  .flatMap(handleUploadResult)
              }
            case None => BadRequest("缺少图片文件，请使用 file 字段上传")
        }
      }

    case req @ GET -> Root / "uploads" / "store-images" / filename =>
      ImageStorageRepo.resolveStoreImagePath(filename) match
        case Some(path) =>
          StaticFile
            .fromPath(Fs2Path.fromNioPath(path), Some(req))
            .getOrElseF(NotFound("图片不存在"))
        case None => NotFound("图片不存在")

    case req @ POST -> Root / "api" / "delivery" / "merchant-applications" / applicationId / "approve" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ReviewMerchantApplicationRequest].flatMap { payload =>
          DeliveryStateRepo.approveMerchantApplication(applicationId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "merchant-applications" / applicationId / "reject" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ReviewMerchantApplicationRequest].flatMap { payload =>
          DeliveryStateRepo.rejectMerchantApplication(applicationId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" =>
      withRole(req, UserRole.merchant) { user =>
        if !DeliveryStateRepo.ownsStore(storeId, user.displayName) then Forbidden("无权修改其他商家的菜品")
        else
          req.as[AddMenuItemRequest].flatMap { payload =>
            DeliveryStateRepo.addMenuItem(storeId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" / menuItemId / "remove" =>
      withRole(req, UserRole.merchant) { user =>
        if !DeliveryStateRepo.ownsStore(storeId, user.displayName) then Forbidden("无权修改其他商家的菜品")
        else DeliveryStateRepo.removeMenuItem(storeId, menuItemId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" / menuItemId / "stock" =>
      withRole(req, UserRole.merchant) { user =>
        if !DeliveryStateRepo.ownsStore(storeId, user.displayName) then Forbidden("无权修改其他商家的菜品")
        else
          req.as[UpdateMenuItemStockRequest].flatMap { payload =>
            DeliveryStateRepo.updateMenuItemStock(storeId, menuItemId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" =>
      withRole(req, UserRole.customer) { user =>
        req.as[CreateOrderRequest].flatMap { payload =>
          if !DeliveryStateRepo.ownsCustomer(payload.customerId, user.linkedProfileId) then Forbidden("无权为其他顾客下单")
          else DeliveryStateRepo.createOrder(payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / "clear" =>
      withRole(req, UserRole.admin) { _ =>
        DeliveryStateRepo.clearOrders().flatMap(state => Ok(state.asJson))
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "accept" =>
      withRole(req, UserRole.merchant) { user =>
        if !DeliveryStateRepo.ownsOrderAsMerchant(orderId, user.displayName) then Forbidden("无权处理其他商家的订单")
        else DeliveryStateRepo.acceptOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "ready" =>
      withRole(req, UserRole.merchant) { user =>
        if !DeliveryStateRepo.ownsOrderAsMerchant(orderId, user.displayName) then Forbidden("无权处理其他商家的订单")
        else DeliveryStateRepo.readyOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "assign-rider" =>
      withRole(req, UserRole.rider) { user =>
        req.as[AssignRiderRequest].flatMap { payload =>
          if !DeliveryStateRepo.ownsRiderProfile(payload.riderId, user.linkedProfileId) then Forbidden("无权为其他骑手抢单")
          else DeliveryStateRepo.assignRider(orderId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "pickup" =>
      withRole(req, UserRole.rider) { user =>
        if !DeliveryStateRepo.ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden("无权处理其他骑手的订单")
        else DeliveryStateRepo.pickupOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "deliver" =>
      withRole(req, UserRole.rider) { user =>
        if !DeliveryStateRepo.ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden("无权处理其他骑手的订单")
        else DeliveryStateRepo.deliverOrder(orderId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "review" =>
      withRole(req, UserRole.customer) { user =>
        if !DeliveryStateRepo.ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden("无权评价其他顾客的订单")
        else
          req.as[ReviewOrderRequest].flatMap { payload =>
            DeliveryStateRepo.reviewOrder(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "chat" =>
      withSession(req) { user =>
        val canChat =
          user.role match
            case UserRole.customer => DeliveryStateRepo.ownsOrderAsCustomer(orderId, user.linkedProfileId)
            case UserRole.merchant => DeliveryStateRepo.ownsOrderAsMerchant(orderId, user.displayName)
            case UserRole.rider => DeliveryStateRepo.ownsOrderAsRider(orderId, user.linkedProfileId)
            case UserRole.admin => false

        if !canChat then Forbidden("无权参与该订单聊天")
        else
          val senderName =
            if user.role == UserRole.customer then
              user.linkedProfileId.map(DeliveryStateRepo.customerAlias).getOrElse(user.displayName)
            else user.displayName
          req.as[SendOrderChatMessageRequest].flatMap { payload =>
            DeliveryStateRepo
              .addOrderChatMessage(orderId, user.role, senderName, payload)
              .flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "partial-refunds" =>
      withRole(req, UserRole.customer) { user =>
        if !DeliveryStateRepo.ownsOrderAsCustomer(orderId, user.linkedProfileId) then Forbidden("无权申请其他顾客的退款")
        else
          req.as[SubmitPartialRefundRequest].flatMap { payload =>
            DeliveryStateRepo.submitPartialRefundRequest(orderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "partial-refunds" / refundId / "review" =>
      withRole(req, UserRole.merchant) { user =>
        if !DeliveryStateRepo.ownsPartialRefundRequestAsMerchant(refundId, user.displayName) then Forbidden("无权处理其他商家的退款申请")
        else
          req.as[ResolvePartialRefundRequest].flatMap { payload =>
            DeliveryStateRepo.resolvePartialRefundRequest(refundId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "review-appeals" =>
      withSession(req) { user =>
        req.as[ReviewAppealRequest].flatMap { payload =>
          val allowed =
            payload.appellantRole match
              case AppealRole.Merchant =>
                user.role == UserRole.merchant && DeliveryStateRepo.ownsOrderAsMerchant(orderId, user.displayName)
              case AppealRole.Rider =>
                user.role == UserRole.rider && DeliveryStateRepo.ownsOrderAsRider(orderId, user.linkedProfileId)
          if !allowed then Forbidden("无权发起该申诉")
          else DeliveryStateRepo.submitReviewAppeal(orderId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "review-appeals" / appealId / "review" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ResolveReviewAppealRequest].flatMap { payload =>
          DeliveryStateRepo.resolveReviewAppeal(appealId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "eligibility-reviews" =>
      withSession(req) { user =>
        req.as[EligibilityReviewRequest].flatMap { payload =>
          val allowed =
            payload.target match
              case EligibilityReviewTarget.Store =>
                user.role == UserRole.merchant && DeliveryStateRepo.ownsStore(payload.targetId, user.displayName)
              case EligibilityReviewTarget.Rider =>
                user.role == UserRole.rider && DeliveryStateRepo.ownsRiderProfile(payload.targetId, user.linkedProfileId)
          if !allowed then Forbidden("无权提交该资格复核")
          else DeliveryStateRepo.submitEligibilityReview(payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "eligibility-reviews" / reviewId / "review" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ResolveEligibilityReviewRequest].flatMap { payload =>
          DeliveryStateRepo.resolveEligibilityReview(reviewId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "resolve" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ResolveTicketRequest].flatMap { payload =>
          DeliveryStateRepo.resolveTicket(orderId, payload).flatMap(handleStateResult)
        }
      }
  }

  private def handleStateResult(result: Either[String, DeliveryAppState]) =
    result match
      case Right(state) => Ok(state.asJson)
      case Left(message) => BadRequest(message)

  private def handleUploadResult(result: Either[String, ImageUploadResponse]) =
    result match
      case Right(response) => Ok(response.asJson)
      case Left(message) => BadRequest(message)

  private def withSession(req: Request[IO])(handle: AuthUser => IO[org.http4s.Response[IO]]) =
    readToken(req) match
      case Some(token) =>
        AuthRepo.getSession(token).flatMap {
          case Some(session) => handle(session.user)
          case None => unauthorized("登录已失效")
        }
      case None => unauthorized("未登录")

  private def withRole(req: Request[IO], role: UserRole)(handle: AuthUser => IO[org.http4s.Response[IO]]) =
    withSession(req) { user =>
      if user.role == role then handle(user)
      else Forbidden(s"当前账号不是${role.toString}角色")
    }

  private def unauthorized(message: String): IO[Response[IO]] =
    IO.pure(Response[IO](status = Status.Unauthorized).withEntity(message))

  private def readToken(req: Request[IO]): Option[String] =
    req.headers.get(CIString("x-session-token")).map(_.head.value)
