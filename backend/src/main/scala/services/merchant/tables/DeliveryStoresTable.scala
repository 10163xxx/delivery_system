package services.merchant.tables

import system.jdbc.*
import cats.effect.IO
import domain.merchant.Store
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val storesDeliveryTable: DeliveryEntityTable[Store] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.StoresTableName, _.id.raw)

private[tables] def initializeDeliveryStoresTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, storesDeliveryTable)

private[tables] def loadPersistedStores(connection: Connection): IO[List[Store]] =
  loadEntityRows(connection, storesDeliveryTable)

private[tables] def replacePersistedStores(
    connection: Connection,
    stores: List[Store],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, storesDeliveryTable, stores, updatedAt)
