package rider.api

import domain.shared.given

import cats.effect.IO
import domain.rider.UpdateRiderProfileRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import rider.app.updateRiderProfile
import shared.api.routing.*
import shared.app.*

val updateRiderProfileApi: FixedMethodApi1[RiderId, DeliveryAppState] =
  jsonPostApi1[RiderId, UpdateRiderProfileRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("riders")),
    List(routeSegment("profile")),
  )
