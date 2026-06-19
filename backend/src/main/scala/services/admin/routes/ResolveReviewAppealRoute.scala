package services.admin.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.admin.api.*

import system.objects.given

import cats.effect.IO
import services.review.objects.apiTypes.ResolveReviewAppealRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.review.objects.{ReviewAppealId}
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
