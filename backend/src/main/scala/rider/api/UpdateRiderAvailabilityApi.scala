package rider.api

import domain.shared.given

import cats.effect.IO
import domain.rider.UpdateRiderAvailabilityRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import rider.app.updateRiderAvailability
import shared.api.routing.*
import shared.app.*

val updateRiderAvailabilityApi: FixedMethodApi1[RiderId, DeliveryAppState] =
  jsonPostApi1[RiderId, UpdateRiderAvailabilityRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("riders")),
    List(routeSegment("availability")),
  )
