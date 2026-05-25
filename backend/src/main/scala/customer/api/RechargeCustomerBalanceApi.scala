package customer.api

import domain.shared.given

import cats.effect.IO
import customer.app.rechargeCustomerBalance
import domain.customer.RechargeBalanceRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*
import shared.app.*

val rechargeCustomerBalanceApi: FixedMethodApi1[CustomerId, DeliveryAppState] =
  jsonPostApi1[CustomerId, RechargeBalanceRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("recharge")),
  )
