package merchant.route

import merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.FileNameText
import fs2.io.file.Path as Fs2Path
import merchant.app.resolveMerchantStoreImagePath
import org.http4s.HttpRoutes
import org.http4s.StaticFile
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import shared.api.routing.*

val getMerchantStoreImageRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(getMerchantStoreImageApi, req) =>
    val Some((matchedReq, filename)) = extractApi1(getMerchantStoreImageApi, req)
    resolveMerchantStoreImagePath(filename) match
      case Some(path) =>
        StaticFile
          .fromPath(Fs2Path.fromNioPath(path), Some(matchedReq))
          .getOrElseF(NotFound(RouteMessages.StoreImageNotFound))
      case None => NotFound(RouteMessages.StoreImageNotFound)
}
