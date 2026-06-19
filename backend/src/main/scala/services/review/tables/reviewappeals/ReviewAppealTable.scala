package services.review.tables.reviewappeals

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.review.objects.ReviewAppeal
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val reviewAppealTable: DeliveryEntityTable[ReviewAppeal] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.ReviewAppealsTableName, _.id.raw)

private[tables] def initializeReviewAppealTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, reviewAppealTable)

private[tables] def loadPersistedReviewAppeals(connection: Connection): IO[List[ReviewAppeal]] =
  loadEntityRows(connection, reviewAppealTable)

private[tables] def replacePersistedReviewAppeals(
    connection: Connection,
    reviewAppeals: List[ReviewAppeal],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, reviewAppealTable, reviewAppeals, updatedAt)
