package customer.route

import customer.api.*

import domain.shared.given

import cats.effect.IO
import customer.app.rechargeCustomerBalance
import domain.customer.RechargeBalanceRequest
import domain.shared.{CustomerId, DeliveryAppState, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*
import shared.app.*

val rechargeCustomerBalanceRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(rechargeCustomerBalanceApi, req) =>
    val Some((matchedReq, customerId)) = extractApi1(rechargeCustomerBalanceApi, req)
    withRole(matchedReq, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.RechargeOtherCustomerForbidden)
      else
        matchedReq.as[RechargeBalanceRequest].flatMap { payload =>
          rechargeCustomerBalance(customerId, payload).flatMap(handleStateResult)
        }
    }
}
