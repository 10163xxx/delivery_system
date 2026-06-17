package services.admin.api

import domain.shared.given

import domain.merchant.ReviewMerchantApplicationRequest
import domain.shared.{DeliveryAppState, MerchantApplicationId}
import system.api.*

val rejectMerchantApplicationApi: FixedMethodApi[PathParam[MerchantApplicationId], DeliveryAppState] =
  jsonPostApi[MerchantApplicationId, ReviewMerchantApplicationRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("merchant-applications")),
    List(routeSegment("reject")),
  )
