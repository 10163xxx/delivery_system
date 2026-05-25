package customer.route

import customer.api.*

import domain.shared.given

import cats.effect.IO
import customer.app.removeCustomerAddress
import domain.customer.RemoveCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*
import shared.app.*

val removeCustomerAddressRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(removeCustomerAddressApi, req) =>
    val Some((matchedReq, customerId)) = extractApi1(removeCustomerAddressApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerAddressForbidden)
      else
        matchedReq.as[RemoveCustomerAddressRequest].flatMap { payload =>
          removeCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }
}
