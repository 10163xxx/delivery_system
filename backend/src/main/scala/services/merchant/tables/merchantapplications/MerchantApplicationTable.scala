package services.merchant.tables.merchantapplications

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.merchant.objects.MerchantApplication
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val merchantApplicationTable: DeliveryEntityTable[MerchantApplication] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.MerchantApplicationsTableName, _.id.raw)

private[tables] def initializeMerchantApplicationTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, merchantApplicationTable)

private[tables] def loadPersistedMerchantApplications(connection: Connection): IO[List[MerchantApplication]] =
  loadEntityRows(connection, merchantApplicationTable)

private[tables] def replacePersistedMerchantApplications(
    connection: Connection,
    merchantApplications: List[MerchantApplication],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, merchantApplicationTable, merchantApplications, updatedAt)
