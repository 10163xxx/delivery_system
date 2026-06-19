package services.review.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.objects.given
import services.review.objects.apiTypes.*
import system.app.objects.*

import cats.effect.IO
import services.review.objects.*
import system.objects.*
import system.app.*

private def hasPendingEligibilityReview(
      current: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): ApprovalFlag =
    new ApprovalFlag(
      current.eligibilityReviews.exists(review =>
        review.target == request.target &&
          review.targetId == request.targetId &&
          review.status == AppealStatus.Pending
      )
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
