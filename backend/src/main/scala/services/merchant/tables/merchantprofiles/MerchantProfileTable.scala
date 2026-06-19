package services.merchant.tables.merchantprofiles

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.merchant.objects.MerchantProfile
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val merchantProfileTable: DeliveryEntityTable[MerchantProfile] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.MerchantProfilesTableName, _.id.raw)

private[tables] def initializeMerchantProfileTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, merchantProfileTable)

private[tables] def loadPersistedMerchantProfiles(connection: Connection): IO[List[MerchantProfile]] =
  loadEntityRows(connection, merchantProfileTable)

private[tables] def replacePersistedMerchantProfiles(
    connection: Connection,
    merchantProfiles: List[MerchantProfile],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, merchantProfileTable, merchantProfiles, updatedAt)
