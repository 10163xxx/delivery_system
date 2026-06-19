package services.merchant.tables.stores

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.merchant.objects.Store
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val storeTable: DeliveryEntityTable[Store] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.StoresTableName, _.id.raw)

private[tables] def initializeStoreTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, storeTable)

private[tables] def loadPersistedStores(connection: Connection): IO[List[Store]] =
  loadEntityRows(connection, storeTable)

private[tables] def replacePersistedStores(
    connection: Connection,
    stores: List[Store],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, storeTable, stores, updatedAt)
