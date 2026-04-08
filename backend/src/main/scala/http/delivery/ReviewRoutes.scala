package http.delivery

import app.delivery.*
import cats.effect.IO
import domain.admin.ResolveTicketRequest
import domain.review.*
import domain.shared.{AppealRole, EligibilityReviewTarget, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import http.support.*

val reviewRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root / "api" / "delivery" / "orders" / orderId / "review-appeals" =>
      withSession(req) { user =>
        req.as[ReviewAppealRequest].flatMap { payload =>
          val allowed =
            payload.appellantRole match
              case AppealRole.Merchant =>
                user.role == UserRole.merchant && ownsOrderAsMerchant(orderId, user.displayName)
              case AppealRole.Rider =>
                user.role == UserRole.rider && ownsOrderAsRider(orderId, user.linkedProfileId)
          if !allowed then Forbidden("无权发起该申诉")
          else submitReviewAppeal(orderId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "review-appeals" / appealId / "review" =>
      withRole(req, UserRole.admin) { _ =>
        req.as[ResolveReviewAppealRequest].flatMap { payload =>
          resolveReviewAppeal(appealId, payload).flatMap(handleStateResult)
        }
      }

    case req @ POST -> Root / "api" / "delivery" / "eligibility-reviews" =>
      withSession(req) { user =>
        req.as[EligibilityReviewRequest].flatMap { payload =>
          val allowed =
            payload.target match
              case EligibilityReviewTarget.Store =>
                user.role == UserRole.merchant && ownsStore(payload.targetId, user.displayName)
              case EligibilityReviewTarget.Rider =>
                user.role == UserRole.rider && ownsRiderProfile(payload.targetId, user.linkedProfileId)
          if !allowed then Forbidden("无权提交该资格复核")
          else submitEligibilityReview(payload).flatMap(handleStateResult)
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
