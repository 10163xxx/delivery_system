package services.rider.api

import domain.shared.given

import domain.rider.UpdateRiderProfileRequest
import domain.shared.{DeliveryAppState, RiderId}
import system.api.*

val updateRiderProfileApi: FixedMethodApi[PathParam[RiderId], DeliveryAppState] =
  jsonPostApi[RiderId, UpdateRiderProfileRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("riders")),
    List(routeSegment("profile")),
  )
