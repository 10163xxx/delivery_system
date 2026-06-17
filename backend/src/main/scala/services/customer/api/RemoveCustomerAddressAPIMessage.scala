package services.customer.api

import domain.shared.given

import domain.customer.RemoveCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState}
import system.api.*

val removeCustomerAddressApi: FixedMethodApi[PathParam[CustomerId], DeliveryAppState] =
  jsonPostApi[CustomerId, RemoveCustomerAddressRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("addresses"), routeSegment("remove")),
  )
