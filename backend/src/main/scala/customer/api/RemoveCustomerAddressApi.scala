package customer.api

import domain.shared.given

import cats.effect.IO
import customer.app.removeCustomerAddress
import domain.customer.RemoveCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*
import shared.app.*

val removeCustomerAddressApi: FixedMethodApi1[CustomerId, DeliveryAppState] =
  jsonPostApi1[CustomerId, RemoveCustomerAddressRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("addresses"), routeSegment("remove")),
  )
