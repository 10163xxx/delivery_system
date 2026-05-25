package rider.api

import domain.shared.given

import cats.effect.IO
import domain.rider.WithdrawRiderIncomeRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import rider.app.withdrawRiderIncome
import shared.api.routing.*
import shared.app.*

val withdrawRiderIncomeApi: FixedMethodApi1[RiderId, DeliveryAppState] =
  jsonPostApi1[RiderId, WithdrawRiderIncomeRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("riders")),
    List(routeSegment("withdraw")),
  )
