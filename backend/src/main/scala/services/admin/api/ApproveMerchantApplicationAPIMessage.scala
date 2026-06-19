package services.admin.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.merchant.objects.apiTypes.ReviewMerchantApplicationRequest
import system.app.objects.{DeliveryAppState}
import services.merchant.objects.{MerchantApplicationId}
import system.api.*

val approveMerchantApplicationApi: FixedMethodApi[PathParam[MerchantApplicationId], DeliveryAppState] =
  jsonPostApi[MerchantApplicationId, ReviewMerchantApplicationRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("merchant-applications")),
    List(routeSegment("approve")),
  )
