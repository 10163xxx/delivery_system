package services.merchant.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.merchant.objects.apiTypes.ImageUploadResponse
import system.objects.{FileNameText, MediaTypeText, UploadDefaults}
import system.api.*

val uploadMerchantStoreImageApi: FixedMethodApi[NoPathParams, ImageUploadResponse] =
  jsonPostApi[Unit, ImageUploadResponse](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("uploads"),
    routeSegment("store-image"),
  )
