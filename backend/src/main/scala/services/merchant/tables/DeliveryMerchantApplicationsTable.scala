package services.merchant.tables

import system.jdbc.*
import cats.effect.IO
import domain.merchant.MerchantApplication
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val merchantApplicationsDeliveryTable: DeliveryEntityTable[MerchantApplication] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.MerchantApplicationsTableName, _.id.raw)

private[tables] def initializeDeliveryMerchantApplicationsTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, merchantApplicationsDeliveryTable)

private[tables] def loadPersistedMerchantApplications(connection: Connection): IO[List[MerchantApplication]] =
  loadEntityRows(connection, merchantApplicationsDeliveryTable)

private[tables] def replacePersistedMerchantApplications(
    connection: Connection,
    merchantApplications: List[MerchantApplication],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, merchantApplicationsDeliveryTable, merchantApplications, updatedAt)
