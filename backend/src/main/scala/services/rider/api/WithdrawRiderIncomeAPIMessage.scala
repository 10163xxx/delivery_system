package services.rider.api

import domain.shared.given

import domain.rider.WithdrawRiderIncomeRequest
import domain.shared.{DeliveryAppState, RiderId}
import system.api.*

val withdrawRiderIncomeApi: FixedMethodApi[PathParam[RiderId], DeliveryAppState] =
  jsonPostApi[RiderId, WithdrawRiderIncomeRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("riders")),
    List(routeSegment("withdraw")),
  )
