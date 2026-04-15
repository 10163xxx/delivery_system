package admin.api

import domain.shared.given

import shared.app.*
import merchant.app.*
import review.app.*
import admin.app.*
import cats.effect.IO
import domain.admin.ResolveTicketRequest
import domain.merchant.ReviewMerchantApplicationRequest
import domain.review.{ResolveEligibilityReviewRequest, ResolveReviewAppealRequest}
import domain.shared.UserRole
import shared.api.support.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*

val adminRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ POST -> Root / "api" / "delivery" / "merchant-applications" / applicationId / "approve" =>
    withRole(req, UserRole.admin) { _ =>
      req.as[ReviewMerchantApplicationRequest].flatMap { payload =>
        approveMerchantApplication(applicationId, payload).flatMap(handleStateResult)
      }
    }

  case req @ POST -> Root / "api" / "delivery" / "merchant-applications" / applicationId / "reject" =>
    withRole(req, UserRole.admin) { _ =>
      req.as[ReviewMerchantApplicationRequest].flatMap { payload =>
        rejectMerchantApplication(applicationId, payload).flatMap(handleStateResult)
      }
    }

  case req @ POST -> Root / "api" / "delivery" / "review-appeals" / appealId / "review" =>
    withRole(req, UserRole.admin) { _ =>
      req.as[ResolveReviewAppealRequest].flatMap { payload =>
        resolveReviewAppeal(appealId, payload).flatMap(handleStateResult)
      }
    }

  case req @ POST -> Root / "api" / "delivery" / "eligibility-reviews" / reviewId / "review" =>
    withRole(req, UserRole.admin) { _ =>
      req.as[ResolveEligibilityReviewRequest].flatMap { payload =>
        resolveEligibilityReview(reviewId, payload).flatMap(handleStateResult)
      }
    }

  case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "resolve" =>
    withRole(req, UserRole.admin) { _ =>
      req.as[ResolveTicketRequest].flatMap { payload =>
        resolveTicket(orderId, payload).flatMap(handleStateResult)
      }
    }
}
