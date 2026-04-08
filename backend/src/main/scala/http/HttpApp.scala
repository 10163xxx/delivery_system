package http

import cats.effect.IO
import cats.syntax.semigroupk.*
import http.auth.authRoutes
import http.delivery.deliveryRoutes
import http.health.healthRoutes
import http.planner.plannerRoutes
import org.http4s.HttpApp
import org.http4s.HttpRoutes
import org.http4s.implicits.*

private val allHttpRoutes: HttpRoutes[IO] =
  healthRoutes <+> authRoutes <+> deliveryRoutes <+> plannerRoutes

val backendHttpApp: HttpApp[IO] = allHttpRoutes.orNotFound
