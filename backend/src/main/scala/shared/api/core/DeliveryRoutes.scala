package shared.api

import domain.shared.given

import admin.route.adminRoutes
import cats.effect.IO
import cats.syntax.semigroupk.*
import customer.route.customerRoutes
import merchant.route.merchantRoutes
import order.route.orderRoutes
import org.http4s.HttpRoutes
import review.route.reviewRoutes
import rider.route.riderRoutes

val deliveryRoutes: HttpRoutes[IO] =
  customerRoutes <+> merchantRoutes <+> riderRoutes <+> orderRoutes <+> reviewRoutes <+> adminRoutes
