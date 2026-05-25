package customer.route

import customer.api.*

import domain.shared.given

import cats.effect.IO
import customer.app.addCustomerAddress
import domain.customer.AddCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*
import shared.app.*

val addCustomerAddressRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(addCustomerAddressApi, req) =>
    val Some((matchedReq, customerId)) = extractApi1(addCustomerAddressApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerAddressForbidden)
      else
        matchedReq.as[AddCustomerAddressRequest].flatMap { payload =>
          addCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }
}
