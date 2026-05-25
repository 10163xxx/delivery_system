package review.route

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val reviewRoutes: HttpRoutes[IO] =
  submitReviewAppealRoute <+> submitEligibilityReviewRoute
