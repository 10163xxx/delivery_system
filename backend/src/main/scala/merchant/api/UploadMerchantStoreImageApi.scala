package merchant.api

import domain.shared.given

import cats.effect.IO
import domain.merchant.ImageUploadResponse
import domain.shared.{FileNameText, MediaTypeText, UploadDefaults, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import org.http4s.headers.`Content-Type`
import org.http4s.multipart.Multipart
import shared.api.routing.*

val uploadMerchantStoreImageApi: FixedMethodApi0[ImageUploadResponse] =
  jsonPostApi0[Unit, ImageUploadResponse](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("uploads"),
    routeSegment("store-image"),
  )
