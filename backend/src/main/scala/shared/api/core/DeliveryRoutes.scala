package shared.api

import domain.shared.given

import admin.api.adminRoutes
import cats.effect.IO
import cats.syntax.semigroupk.*
import customer.api.customerRoutes
import merchant.api.merchantRoutes
import order.api.orderRoutes
import org.http4s.HttpRoutes
import review.api.reviewRoutes
import rider.api.riderRoutes

val deliveryRoutes: HttpRoutes[IO] =
  customerRoutes <+> merchantRoutes <+> riderRoutes <+> orderRoutes <+> reviewRoutes <+> adminRoutes
