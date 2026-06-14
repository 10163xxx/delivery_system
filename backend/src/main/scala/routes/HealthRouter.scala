package routes

import cats.effect.IO
import org.http4s.HttpRoutes
import system.api.health.healthRoute

val healthRouter: HttpRoutes[IO] =
  healthRoute
