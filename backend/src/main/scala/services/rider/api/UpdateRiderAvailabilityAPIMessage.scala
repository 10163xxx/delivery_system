package services.rider.api

import domain.shared.given

import domain.rider.UpdateRiderAvailabilityRequest
import domain.shared.{DeliveryAppState, RiderId}
import system.api.*

val updateRiderAvailabilityApi: FixedMethodApi[PathParam[RiderId], DeliveryAppState] =
  jsonPostApi[RiderId, UpdateRiderAvailabilityRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("riders")),
    List(routeSegment("availability")),
  )
