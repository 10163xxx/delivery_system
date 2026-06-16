package services.customer.routes

import services.customer.api.*

import domain.shared.given

import cats.effect.IO
import services.customer.utils.rechargeCustomerBalance
import domain.customer.RechargeBalanceRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*
import system.app.*

val rechargeCustomerBalanceRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(rechargeCustomerBalanceApi, req) =>
    val (matchedReq, customerId) = requireApi1(rechargeCustomerBalanceApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.RechargeOtherCustomerForbidden)
      else
        matchedReq.as[RechargeBalanceRequest].flatMap { payload =>
          rechargeCustomerBalance(customerId, payload).flatMap(handleStateResult)
        }
    }
}
