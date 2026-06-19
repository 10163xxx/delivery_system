package services.customer.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.customer.objects.apiTypes.RechargeBalanceRequest
import system.app.objects.{DeliveryAppState}
import services.customer.objects.{CustomerId}
import system.api.*

val rechargeCustomerBalanceApi: FixedMethodApi[PathParam[CustomerId], DeliveryAppState] =
  jsonPostApi[CustomerId, RechargeBalanceRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("recharge")),
  )
