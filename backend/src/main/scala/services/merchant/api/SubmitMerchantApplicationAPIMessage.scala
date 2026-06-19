package services.merchant.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.merchant.objects.apiTypes.MerchantRegistrationRequest
import system.app.objects.{DeliveryAppState}
import system.api.*

val submitMerchantApplicationApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[MerchantRegistrationRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-applications"),
  )
