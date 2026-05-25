package admin.route

import domain.shared.given

import cats.effect.IO
import cats.syntax.semigroupk.*
import org.http4s.HttpRoutes

val adminRoutes: HttpRoutes[IO] =
  approveMerchantApplicationRoute <+>
    rejectMerchantApplicationRoute <+>
    resolveReviewAppealRoute <+>
    resolveEligibilityReviewRoute <+>
    resolveTicketRoute
