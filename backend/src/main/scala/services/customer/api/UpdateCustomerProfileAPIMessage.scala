package services.customer.api

import domain.shared.given

import domain.customer.UpdateCustomerProfileRequest
import domain.shared.{CustomerId, DeliveryAppState}
import system.api.*

val updateCustomerProfileApi: FixedMethodApi[PathParam[CustomerId], DeliveryAppState] =
  jsonPostApi[CustomerId, UpdateCustomerProfileRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("profile")),
  )
