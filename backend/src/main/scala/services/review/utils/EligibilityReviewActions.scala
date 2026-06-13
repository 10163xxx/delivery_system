package services.review.utils

import domain.shared.given

import cats.effect.IO
import domain.review.*
import domain.shared.*
import system.app.*

private def hasPendingEligibilityReview(
      current: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): ApprovalFlag =
    current.eligibilityReviews.exists(review =>
      review.target == request.target &&
        review.targetId == request.targetId &&
        review.status == AppealStatus.Pending
    )

def submitEligibilityReview(
      request: EligibilityReviewRequest
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          targetName <- findEligibilityTargetName(current, request)
          _ <- validateEligibilityTargetState(current, request)
          _ <- Either.cond(!hasPendingEligibilityReview(current, request), (), ValidationMessages.Review.PendingEligibilityReviewExists)
          reason <- sanitizeEligibilityReason(request.reason)
        yield
          val timestamp = now()
          val review = buildEligibilityReview(request, targetName, reason, timestamp)
          withDerivedData(current.copy(eligibilityReviews = review :: current.eligibilityReviews))
      }
    }

def resolveEligibilityReview(
      reviewId: EligibilityReviewId,
      request: ResolveEligibilityReviewRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          review <- findEligibilityReview(current, reviewId)
          _ <- requirePendingEligibilityReview(review)
          resolutionNote <- sanitizeResolutionNote(request.resolutionNote, ValidationMessages.Review.EligibilityReviewResolutionRequired)
        yield
          val timestamp = now()
          val reviewed = reviewEligibility(review, request.approved, resolutionNote, timestamp)
          withDerivedData(
            current.copy(eligibilityReviews = replaceEligibilityReview(current.eligibilityReviews, reviewed))
          )
      }
    }
