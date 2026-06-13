package services.review.tables

import system.jdbc.*
import cats.effect.IO
import domain.review.ReviewAppeal
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val reviewAppealsDeliveryTable: DeliveryEntityTable[ReviewAppeal] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.ReviewAppealsTableName, _.id.raw)

private[tables] def initializeDeliveryReviewAppealsTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, reviewAppealsDeliveryTable)

private[tables] def loadPersistedReviewAppeals(connection: Connection): IO[List[ReviewAppeal]] =
  loadEntityRows(connection, reviewAppealsDeliveryTable)

private[tables] def replacePersistedReviewAppeals(
    connection: Connection,
    reviewAppeals: List[ReviewAppeal],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, reviewAppealsDeliveryTable, reviewAppeals, updatedAt)
