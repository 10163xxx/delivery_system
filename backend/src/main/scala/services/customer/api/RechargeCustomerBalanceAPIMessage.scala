package services.customer.api

import domain.shared.given

import domain.customer.RechargeBalanceRequest
import domain.shared.{CustomerId, DeliveryAppState}
import system.api.*

val rechargeCustomerBalanceApi: FixedMethodApi[PathParam[CustomerId], DeliveryAppState] =
  jsonPostApi[CustomerId, RechargeBalanceRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("recharge")),
  )
