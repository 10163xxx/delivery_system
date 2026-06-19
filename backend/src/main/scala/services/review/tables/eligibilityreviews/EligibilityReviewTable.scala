package services.review.tables.eligibilityreviews

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.review.objects.EligibilityReview
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val eligibilityReviewTable: DeliveryEntityTable[EligibilityReview] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.EligibilityReviewsTableName, _.id.raw)

private[tables] def initializeEligibilityReviewTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, eligibilityReviewTable)

private[tables] def loadPersistedEligibilityReviews(connection: Connection): IO[List[EligibilityReview]] =
  loadEntityRows(connection, eligibilityReviewTable)

private[tables] def replacePersistedEligibilityReviews(
    connection: Connection,
    eligibilityReviews: List[EligibilityReview],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, eligibilityReviewTable, eligibilityReviews, updatedAt)
