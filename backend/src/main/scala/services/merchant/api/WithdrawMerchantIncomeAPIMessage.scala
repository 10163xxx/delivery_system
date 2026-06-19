package services.merchant.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.merchant.objects.apiTypes.WithdrawMerchantIncomeRequest
import system.app.objects.{DeliveryAppState}
import system.api.*

val withdrawMerchantIncomeApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[WithdrawMerchantIncomeRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("merchant-profile"),
    routeSegment("withdraw"),
  )
