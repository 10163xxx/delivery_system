package services.rider.tables.riders

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.rider.objects.Rider
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val riderTable: DeliveryEntityTable[Rider] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.RidersTableName, _.id.raw)

private[tables] def initializeRiderTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, riderTable)

private[tables] def loadPersistedRiders(connection: Connection): IO[List[Rider]] =
  loadEntityRows(connection, riderTable)

private[tables] def replacePersistedRiders(
    connection: Connection,
    riders: List[Rider],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, riderTable, riders, updatedAt)
