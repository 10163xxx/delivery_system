package services.customer.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.customer.api.*

import system.objects.given

import cats.effect.IO
import services.customer.utils.updateCustomerProfile
import services.customer.objects.apiTypes.UpdateCustomerProfileRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.customer.objects.{CustomerId}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*
import system.app.*

val updateCustomerProfileRoute: HttpRoutes[IO] = apiRoute(updateCustomerProfileApi) { case (matchedReq, customerId) =>
  withRole(matchedReq, UserRole.customer) { user =>
    if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerProfileForbidden)
    else
      matchedReq.as[UpdateCustomerProfileRequest].flatMap { payload =>
        updateCustomerProfile(customerId, payload).flatMap(handleStateResult)
      }
  }
}
