package services.merchant.api

import domain.shared.given

import domain.merchant.ImageUploadResponse
import domain.shared.{FileNameText, MediaTypeText, UploadDefaults}
import system.api.*

val uploadMerchantStoreImageApi: FixedMethodApi[NoPathParams, ImageUploadResponse] =
  jsonPostApi[Unit, ImageUploadResponse](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("uploads"),
    routeSegment("store-image"),
  )
