package services.review.tables

import cats.effect.IO
import domain.review.{EligibilityReview, PersistedReviewState, ReviewAppeal}

import java.sql.{Connection, Timestamp}

def initializeReviewTables(connection: Connection): IO[Unit] =
  List(
    initializeDeliveryReviewAppealsTable(connection),
    initializeDeliveryEligibilityReviewsTable(connection),
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
