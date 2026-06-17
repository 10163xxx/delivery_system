package services.admin.routes

import services.admin.api.*

import domain.shared.given

import cats.effect.IO
import domain.review.ResolveReviewAppealRequest
import domain.shared.{DeliveryAppState, ReviewAppealId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.*
import system.api.*

val resolveReviewAppealRoute: HttpRoutes[IO] = apiRoute(resolveReviewAppealApi) { case (matchedReq, appealId) =>
  withRole(matchedReq, UserRole.admin) { _ =>
    matchedReq.as[ResolveReviewAppealRequest].flatMap { payload =>
      resolveReviewAppeal(appealId, payload).flatMap(handleStateResult)
    }
  }
}
