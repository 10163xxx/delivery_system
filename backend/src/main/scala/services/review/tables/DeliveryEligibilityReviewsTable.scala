package services.review.tables

import system.jdbc.*
import cats.effect.IO
import domain.review.EligibilityReview
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val eligibilityReviewsDeliveryTable: DeliveryEntityTable[EligibilityReview] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.EligibilityReviewsTableName, _.id.raw)

private[tables] def initializeDeliveryEligibilityReviewsTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, eligibilityReviewsDeliveryTable)

private[tables] def loadPersistedEligibilityReviews(connection: Connection): IO[List[EligibilityReview]] =
  loadEntityRows(connection, eligibilityReviewsDeliveryTable)

private[tables] def replacePersistedEligibilityReviews(
    connection: Connection,
    eligibilityReviews: List[EligibilityReview],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, eligibilityReviewsDeliveryTable, eligibilityReviews, updatedAt)
