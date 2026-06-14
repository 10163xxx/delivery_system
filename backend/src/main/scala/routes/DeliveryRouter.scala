package routes

import domain.shared.given

import services.admin.routes.adminRoutes
import cats.effect.IO
import cats.syntax.semigroupk.*
import services.customer.routes.customerRoutes
import services.merchant.routes.merchantRoutes
import services.order.routes.orderRoutes
import org.http4s.HttpRoutes
import services.review.routes.reviewRoutes
import services.rider.routes.riderRoutes

val deliveryRouter: HttpRoutes[IO] =
  customerRoutes <+> merchantRoutes <+> riderRoutes <+> orderRoutes <+> reviewRoutes <+> adminRoutes
