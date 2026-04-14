package api.delivery

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val deliveryRoutes: HttpRoutes[IO] =
  customerRoutes <+> merchantRoutes <+> riderRoutes <+> orderRoutes <+> reviewRoutes <+> adminRoutes
