package services.customer.api

import domain.shared.given

import cats.effect.IO
import services.customer.utils.addCustomerAddress
import domain.customer.AddCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*
import system.app.*

val addCustomerAddressApi: FixedMethodApi1[CustomerId, DeliveryAppState] =
  jsonPostApi1[CustomerId, AddCustomerAddressRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("addresses")),
  )
