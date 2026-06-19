package services.rider.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import system.objects.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val riderRoutes: HttpRoutes[IO] =
  updateRiderProfileRoute <+> withdrawRiderIncomeRoute <+> updateRiderAvailabilityRoute
