package services.customer.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.customer.api.*

import system.objects.given

import cats.effect.IO
import services.customer.utils.setDefaultCustomerAddress
import services.customer.objects.apiTypes.SetDefaultCustomerAddressRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.customer.objects.{CustomerId}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*
import system.app.*

val setDefaultCustomerAddressRoute: HttpRoutes[IO] = apiRoute(setDefaultCustomerAddressApi) { case (matchedReq, customerId) =>
  withRole(matchedReq, UserRole.customer) { user =>
    if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerAddressForbidden)
    else
      matchedReq.as[SetDefaultCustomerAddressRequest].flatMap { payload =>
        setDefaultCustomerAddress(customerId, payload).flatMap(handleStateResult)
      }
  }
}
