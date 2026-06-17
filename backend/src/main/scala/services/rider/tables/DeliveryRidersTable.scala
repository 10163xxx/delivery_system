package services.rider.tables

import system.jdbc.*
import cats.effect.IO
import domain.rider.Rider
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val ridersDeliveryTable: DeliveryEntityTable[Rider] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.RidersTableName, _.id.raw)

private[tables] def initializeDeliveryRidersTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, ridersDeliveryTable)

private[tables] def loadPersistedRiders(connection: Connection): IO[List[Rider]] =
  loadEntityRows(connection, ridersDeliveryTable)

private[tables] def replacePersistedRiders(
    connection: Connection,
    riders: List[Rider],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, ridersDeliveryTable, riders, updatedAt)
