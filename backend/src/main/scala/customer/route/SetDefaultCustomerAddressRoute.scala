package customer.route

import customer.api.*

import domain.shared.given

import cats.effect.IO
import customer.app.setDefaultCustomerAddress
import domain.customer.SetDefaultCustomerAddressRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*
import shared.app.*

val setDefaultCustomerAddressRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(setDefaultCustomerAddressApi, req) =>
    val Some((matchedReq, customerId)) = extractApi1(setDefaultCustomerAddressApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerAddressForbidden)
      else
        matchedReq.as[SetDefaultCustomerAddressRequest].flatMap { payload =>
          setDefaultCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }
}
