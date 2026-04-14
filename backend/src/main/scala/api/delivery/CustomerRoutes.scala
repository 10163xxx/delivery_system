package api.delivery

import domain.shared.given

import app.delivery.*
import cats.effect.IO
import io.circe.syntax.*
import domain.customer.*
import domain.shared.UserRole
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import api.support.*

val customerRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ GET -> Root / "api" / "delivery" / "state" =>
    withSession(req) { _ =>
      getState.flatMap(state => Ok(state.asJson))
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "profile" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerProfileForbidden)
      else
        req.as[UpdateCustomerProfileRequest].flatMap { payload =>
          updateCustomerProfile(customerId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerAddressForbidden)
      else
        req.as[AddCustomerAddressRequest].flatMap { payload =>
          addCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" / "remove" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerAddressForbidden)
      else
        req.as[RemoveCustomerAddressRequest].flatMap { payload =>
          removeCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" / "default" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherCustomerAddressForbidden)
      else
        req.as[SetDefaultCustomerAddressRequest].flatMap { payload =>
          setDefaultCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "recharge" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden(RouteMessages.RechargeOtherCustomerForbidden)
      else
        req.as[RechargeBalanceRequest].flatMap { payload =>
          rechargeCustomerBalance(customerId, payload).flatMap(handleStateResult)
        }
    }
}
