package services.merchant.api

import domain.shared.given

import domain.merchant.WithdrawMerchantIncomeRequest
import domain.shared.{DeliveryAppState}
import system.api.*

val withdrawMerchantIncomeApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[WithdrawMerchantIncomeRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-profile"),
    routeSegment("withdraw"),
  )
