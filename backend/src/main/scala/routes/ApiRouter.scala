package routes

import system.objects.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import services.auth.routes.authRoutes


import org.http4s.HttpApp
import org.http4s.HttpRoutes
import org.http4s.implicits.*

private val allHttpRoutes: HttpRoutes[IO] =
  healthRouter <+> authRoutes <+> deliveryRouter <+> plannerRouter

val apiRouter: HttpApp[IO] = allHttpRoutes.orNotFound
