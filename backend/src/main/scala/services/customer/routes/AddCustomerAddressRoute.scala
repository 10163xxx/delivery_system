package services.customer.routes

import services.customer.api.*

import domain.shared.given

import cats.effect.IO
import services.customer.utils.addCustomerAddress
import domain.customer.AddCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*
import system.app.*

val addCustomerAddressRoute: HttpRoutes[IO] = apiRoute(addCustomerAddressApi) { case (matchedReq, customerId) =>
  withRole(matchedReq, UserRole.customer) { user =>
    if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerAddressForbidden)
    else
      matchedReq.as[AddCustomerAddressRequest].flatMap { payload =>
        addCustomerAddress(customerId, payload).flatMap(handleStateResult)
      }
  }
}
