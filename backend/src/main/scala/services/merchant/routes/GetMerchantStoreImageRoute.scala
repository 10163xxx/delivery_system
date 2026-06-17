package services.merchant.routes

import services.merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.FileNameText
import services.merchant.utils.findMerchantStoreImage
import org.http4s.HttpRoutes
import org.http4s.MediaType
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import org.http4s.headers.`Content-Type`
import system.api.*

val getMerchantStoreImageRoute: HttpRoutes[IO] = apiRoute(getMerchantStoreImageApi) { case (matchedReq, filename) =>
  findMerchantStoreImage(filename).flatMap {
    case Some(image) =>
      val contentType = MediaType.parse(image.mediaType.raw).toOption.map(`Content-Type`(_))
      Ok(image.bytes).map(response => contentType.fold(response)(response.withContentType))
    case None => NotFound(RouteMessages.StoreImageNotFound)
  }
}
