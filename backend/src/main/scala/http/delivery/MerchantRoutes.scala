package http.delivery

import app.delivery.*
import cats.effect.IO
import fs2.io.file.Path as Fs2Path
import domain.merchant.*
import domain.rider.{UpdateRiderProfileRequest, WithdrawRiderIncomeRequest}
import domain.shared.UserRole
import domain.shared.UploadDefaults
import org.http4s.HttpRoutes
import org.http4s.StaticFile
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import org.http4s.headers.`Content-Type`
import org.http4s.multipart.Multipart
import http.support.*
import infra.uploads.*

val merchantRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root / "api" / "delivery" / "merchant-profile" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsMerchantProfile(user.displayName, user.linkedProfileId) then Forbidden("无权修改其他商家资料")
        else
          req.as[UpdateMerchantProfileRequest].flatMap { payload =>
            updateMerchantProfile(user.displayName, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "merchant-profile" / "withdraw" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsMerchantProfile(user.displayName, user.linkedProfileId) then Forbidden("无权发起其他商家的提现")
        else
          req.as[WithdrawMerchantIncomeRequest].flatMap { payload =>
            withdrawMerchantIncome(user.displayName, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "riders" / riderId / "profile" =>
      withRole(req, UserRole.rider) { user =>
        if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden("无权修改其他骑手资料")
        else
          req.as[UpdateRiderProfileRequest].flatMap { payload =>
            updateRiderProfile(riderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "riders" / riderId / "withdraw" =>
      withRole(req, UserRole.rider) { user =>
        if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden("无权发起其他骑手的提现")
        else
          req.as[WithdrawRiderIncomeRequest].flatMap { payload =>
            withdrawRiderIncome(riderId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "merchant-applications" =>
      withRole(req, UserRole.merchant) { user =>
        req.as[MerchantRegistrationRequest].flatMap { payload =>
          submitMerchantApplication(payload.copy(merchantName = user.displayName))
            .flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "uploads" / "store-image" =>
      withRole(req, UserRole.merchant) { _ =>
        req.as[Multipart[IO]].flatMap { multipart =>
          multipart.parts.find(_.name.contains(UploadDefaults.MultipartFileField)) match
            case Some(filePart) =>
              filePart.body.compile.to(Array).flatMap { bytes =>
                val mediaType = filePart.headers.get[`Content-Type`].map(_.mediaType.toString)
                saveStoreImage(filePart.filename, mediaType, bytes)
                  .flatMap(handleUploadResult)
              }
            case None => BadRequest(s"缺少图片文件，请使用 ${UploadDefaults.MultipartFileField} 字段上传")
        }
      }

    case req @ GET -> Root / "uploads" / "store-images" / filename =>
      resolveStoreImagePath(filename) match
        case Some(path) =>
          StaticFile
            .fromPath(Fs2Path.fromNioPath(path), Some(req))
            .getOrElseF(NotFound("图片不存在"))
        case None => NotFound("图片不存在")

    case req @ POST -> Root / "api" / "delivery" / "merchant-applications" / applicationId / "approve" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ReviewMerchantApplicationRequest].flatMap { payload =>
          approveMerchantApplication(applicationId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "merchant-applications" / applicationId / "reject" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ReviewMerchantApplicationRequest].flatMap { payload =>
          rejectMerchantApplication(applicationId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsStore(storeId, user.displayName) then Forbidden("无权修改其他商家的菜品")
        else
          req.as[AddMenuItemRequest].flatMap { payload =>
            addMenuItem(storeId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" / menuItemId / "remove" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsStore(storeId, user.displayName) then Forbidden("无权修改其他商家的菜品")
        else removeMenuItem(storeId, menuItemId).flatMap(handleStateResult)
      }

    case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" / menuItemId / "stock" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsStore(storeId, user.displayName) then Forbidden("无权修改其他商家的菜品")
        else
          req.as[UpdateMenuItemStockRequest].flatMap { payload =>
            updateMenuItemStock(storeId, menuItemId, payload).flatMap(handleStateResult)
          }
      }

    case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "operations" =>
      withRole(req, UserRole.merchant) { user =>
        if !ownsStore(storeId, user.displayName) then Forbidden("无权修改其他商家的店铺信息")
        else
          req.as[UpdateStoreOperationalRequest].flatMap { payload =>
            updateStoreOperationalInfo(storeId, payload).flatMap(handleStateResult)
          }
      }
}
