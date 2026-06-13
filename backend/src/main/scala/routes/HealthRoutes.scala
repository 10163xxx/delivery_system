package routes

import cats.effect.IO
import org.http4s.HttpRoutes
import system.api.health.healthRoute

val healthRoutes: HttpRoutes[IO] =
  healthRoute
