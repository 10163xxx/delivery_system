package services.customer.api

import domain.shared.given

import domain.customer.AddCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState}
import system.api.*

val addCustomerAddressApi: FixedMethodApi[PathParam[CustomerId], DeliveryAppState] =
  jsonPostApi[CustomerId, AddCustomerAddressRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("addresses")),
  )
