package services.review.tables

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import services.review.objects.{EligibilityReview, PersistedReviewState, ReviewAppeal}
import services.review.tables.eligibilityreviews.*
import services.review.tables.reviewappeals.*

import java.sql.{Connection, Timestamp}

def initializeReviewTables(connection: Connection): IO[Unit] =
  List(
    initializeReviewAppealTable(connection),
    initializeEligibilityReviewTable(connection),
  ).foldLeft(IO.unit)(_ *> _)

def loadPersistedReviewState(connection: Connection): IO[PersistedReviewState] =
  for
    reviewAppeals <- loadPersistedReviewAppeals(connection)
    eligibilityReviews <- loadPersistedEligibilityReviews(connection)
  yield PersistedReviewState(
    reviewAppeals = reviewAppeals,
    eligibilityReviews = eligibilityReviews,
  )

def replacePersistedReviewState(
    connection: Connection,
    reviewAppeals: List[ReviewAppeal],
    eligibilityReviews: List[EligibilityReview],
    updatedAt: Timestamp,
): Unit =
  replacePersistedReviewAppeals(connection, reviewAppeals, updatedAt)
  replacePersistedEligibilityReviews(connection, eligibilityReviews, updatedAt)
