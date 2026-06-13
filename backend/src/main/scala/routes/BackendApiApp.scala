package routes

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import services.auth.routes.authRoutes


import org.http4s.HttpApp
import org.http4s.HttpRoutes
import org.http4s.implicits.*

private val allHttpRoutes: HttpRoutes[IO] =
  healthRoutes <+> authRoutes <+> deliveryRoutes <+> plannerRoutes

val backendApiApp: HttpApp[IO] = allHttpRoutes.orNotFound
