package http.delivery

import app.delivery.*
import cats.effect.IO
import io.circe.syntax.*
import domain.customer.*
import domain.shared.UserRole
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import http.support.*

val customerRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ GET -> Root / "api" / "delivery" / "state" =>
    withSession(req) { _ =>
      getState.flatMap(state => Ok(state.asJson))
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "profile" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权修改其他顾客资料")
      else
        req.as[UpdateCustomerProfileRequest].flatMap { payload =>
          updateCustomerProfile(customerId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权修改其他顾客地址")
      else
        req.as[AddCustomerAddressRequest].flatMap { payload =>
          addCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" / "remove" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权修改其他顾客地址")
      else
        req.as[RemoveCustomerAddressRequest].flatMap { payload =>
          removeCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "addresses" / "default" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权修改其他顾客地址")
      else
        req.as[SetDefaultCustomerAddressRequest].flatMap { payload =>
          setDefaultCustomerAddress(customerId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "customers" / customerId / "recharge" =>
    withRole(req, UserRole.customer) { user =>
      if !ownsCustomer(customerId, user.linkedProfileId) then Forbidden("无权为其他顾客充值")
      else
        req.as[RechargeBalanceRequest].flatMap { payload =>
          rechargeCustomerBalance(customerId, payload).flatMap(handleStateResult)
        }
    }
}
