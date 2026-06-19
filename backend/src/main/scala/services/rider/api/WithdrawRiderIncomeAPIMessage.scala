package services.rider.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.rider.objects.apiTypes.WithdrawRiderIncomeRequest
import system.app.objects.{DeliveryAppState}
import services.rider.objects.{RiderId}
import system.api.*

val withdrawRiderIncomeApi: FixedMethodApi[PathParam[RiderId], DeliveryAppState] =
  jsonPostApi[RiderId, WithdrawRiderIncomeRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("riders")),
    List(routeSegment("withdraw")),
  )
