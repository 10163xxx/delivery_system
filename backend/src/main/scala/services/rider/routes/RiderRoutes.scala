package services.rider.routes

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val riderRoutes: HttpRoutes[IO] =
  updateRiderProfileRoute <+> withdrawRiderIncomeRoute <+> updateRiderAvailabilityRoute
