package services.merchant.api

import domain.shared.given

import domain.merchant.UpdateMerchantProfileRequest
import domain.shared.{DeliveryAppState}
import system.api.*

val updateMerchantProfileApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[UpdateMerchantProfileRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-profile"),
  )
