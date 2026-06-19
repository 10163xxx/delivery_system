package services.merchant.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.merchant.objects.apiTypes.UpdateMerchantProfileRequest
import system.app.objects.{DeliveryAppState}
import system.api.*

val updateMerchantProfileApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[UpdateMerchantProfileRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-profile"),
  )
