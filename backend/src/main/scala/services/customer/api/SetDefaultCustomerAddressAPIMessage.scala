package services.customer.api

import domain.shared.given

import domain.customer.SetDefaultCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState}
import system.api.*

val setDefaultCustomerAddressApi: FixedMethodApi[PathParam[CustomerId], DeliveryAppState] =
  jsonPostApi[CustomerId, SetDefaultCustomerAddressRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("addresses"), routeSegment("default")),
  )
