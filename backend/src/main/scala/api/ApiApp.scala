package api

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import api.auth.authRoutes
import api.delivery.deliveryRoutes
import api.health.healthRoutes
import api.planner.plannerRoutes
import org.http4s.HttpApp
import org.http4s.HttpRoutes
import org.http4s.implicits.*

private val allHttpRoutes: HttpRoutes[IO] =
  healthRoutes <+> authRoutes <+> deliveryRoutes <+> plannerRoutes

val backendApiApp: HttpApp[IO] = allHttpRoutes.orNotFound
