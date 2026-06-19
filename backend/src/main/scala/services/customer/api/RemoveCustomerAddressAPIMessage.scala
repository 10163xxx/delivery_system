package services.customer.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.customer.objects.apiTypes.RemoveCustomerAddressRequest
import system.app.objects.{DeliveryAppState}
import services.customer.objects.{CustomerId}
import system.api.*

val removeCustomerAddressApi: FixedMethodApi[PathParam[CustomerId], DeliveryAppState] =
  jsonPostApi[CustomerId, RemoveCustomerAddressRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("addresses"), routeSegment("remove")),
  )
