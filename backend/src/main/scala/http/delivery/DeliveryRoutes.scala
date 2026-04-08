package http.delivery

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val deliveryRoutes: HttpRoutes[IO] =
  customerRoutes <+> merchantRoutes <+> orderRoutes <+> reviewRoutes
