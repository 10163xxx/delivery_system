package services.customer.routes

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val customerRoutes: HttpRoutes[IO] =
  getStateRoute <+>
    updateCustomerProfileRoute <+>
    addCustomerAddressRoute <+>
    removeCustomerAddressRoute <+>
    setDefaultCustomerAddressRoute <+>
    rechargeCustomerBalanceRoute
