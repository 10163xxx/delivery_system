package services.merchant.api

import domain.shared.given

import domain.merchant.MerchantRegistrationRequest
import domain.shared.{DeliveryAppState}
import system.api.*

val submitMerchantApplicationApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[MerchantRegistrationRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-applications"),
  )
