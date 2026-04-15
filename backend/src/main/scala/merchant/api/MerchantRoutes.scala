package merchant.api

import domain.shared.given

import shared.app.*
import merchant.app.*
import cats.effect.IO
import fs2.io.file.Path as Fs2Path
import domain.merchant.*
import domain.shared.{FileNameText, MediaTypeText, UploadDefaults, UserRole}
import shared.api.support.*
import org.http4s.HttpRoutes
import org.http4s.StaticFile
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import org.http4s.headers.`Content-Type`
import org.http4s.multipart.Multipart

val merchantRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ POST -> Root / "api" / "delivery" / "merchant-profile" =>
    withRole(req, UserRole.merchant) { user =>
      if !ownsMerchantProfile(user.displayName, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherMerchantProfileForbidden)
      else
        req.as[UpdateMerchantProfileRequest].flatMap { payload =>
          updateMerchantProfile(user.displayName, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "merchant-profile" / "withdraw" =>
    withRole(req, UserRole.merchant) { user =>
      if !ownsMerchantProfile(user.displayName, user.linkedProfileId) then Forbidden(RouteMessages.WithdrawOtherMerchantIncomeForbidden)
      else
        req.as[WithdrawMerchantIncomeRequest].flatMap { payload =>
          withdrawMerchantIncome(user.displayName, payload).flatMap(handleStateResult)
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
        multipart.parts.find(_.name.contains(UploadDefaults.MultipartFileField.raw)) match
          case Some(filePart) =>
            filePart.body.compile.to(Array).flatMap { bytes =>
              val mediaType = filePart.headers.get[`Content-Type`].map(_.mediaType.toString)
              saveMerchantStoreImage(filePart.filename.map(value => new FileNameText(value)), mediaType.map(value => new MediaTypeText(value)), bytes)
                .flatMap(handleUploadResult)
            }
          case None => BadRequest(missingMultipartFile(UploadDefaults.MultipartFileField))
      }
    }

  case req @ GET -> Root / "uploads" / "store-images" / filename =>
    resolveMerchantStoreImagePath(new FileNameText(filename)) match
      case Some(path) =>
        StaticFile
          .fromPath(Fs2Path.fromNioPath(path), Some(req))
          .getOrElseF(NotFound(RouteMessages.StoreImageNotFound))
      case None => NotFound(RouteMessages.StoreImageNotFound)

  case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" =>
    withRole(req, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else
        req.as[AddMenuItemRequest].flatMap { payload =>
          addMenuItem(storeId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" / menuItemId / "remove" =>
    withRole(req, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else removeMenuItem(storeId, menuItemId).flatMap(handleStateResult)
    }

  case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" / menuItemId / "stock" =>
    withRole(req, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else
        req.as[UpdateMenuItemStockRequest].flatMap { payload =>
          updateMenuItemStock(storeId, menuItemId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "menu" / menuItemId / "price" =>
    withRole(req, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else
        req.as[UpdateMenuItemPriceRequest].flatMap { payload =>
          updateMenuItemPrice(storeId, menuItemId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "stores" / storeId / "operations" =>
    withRole(req, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantStoreForbidden)
      else
        req.as[UpdateStoreOperationalRequest].flatMap { payload =>
          updateStoreOperationalInfo(storeId, payload).flatMap(handleStateResult)
        }
    }
}
