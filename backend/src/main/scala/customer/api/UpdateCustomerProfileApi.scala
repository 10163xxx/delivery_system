package customer.api

import domain.shared.given

import cats.effect.IO
import customer.app.updateCustomerProfile
import domain.customer.UpdateCustomerProfileRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*
import shared.app.*

val updateCustomerProfileApi: FixedMethodApi1[CustomerId, DeliveryAppState] =
  jsonPostApi1[CustomerId, UpdateCustomerProfileRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("customers")),
    List(routeSegment("profile")),
  )
