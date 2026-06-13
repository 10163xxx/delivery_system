package services.customer.routes

import services.customer.api.*

import domain.shared.given

import cats.effect.IO
import services.customer.utils.updateCustomerProfile
import domain.customer.UpdateCustomerProfileRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*
import system.app.*

val updateCustomerProfileRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(updateCustomerProfileApi, req) =>
    val Some((matchedReq, customerId)) = extractApi1(updateCustomerProfileApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerProfileForbidden)
      else
        matchedReq.as[UpdateCustomerProfileRequest].flatMap { payload =>
          updateCustomerProfile(customerId, payload).flatMap(handleStateResult)
        }
    }
}
