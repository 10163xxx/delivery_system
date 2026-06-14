package routes

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes
import system.api.planner.{echoPlannerRoute, saveDemoNotePlannerRoute}

val plannerRouter: HttpRoutes[IO] =
  echoPlannerRoute <+> saveDemoNotePlannerRoute
