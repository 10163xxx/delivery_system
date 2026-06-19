package services.merchant.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.merchant.api.*

import system.objects.given

import cats.effect.IO
import system.objects.FileNameText
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
