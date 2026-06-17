package services.merchant.tables

import system.jdbc.*
import cats.effect.IO
import domain.merchant.MerchantProfile
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val merchantProfilesDeliveryTable: DeliveryEntityTable[MerchantProfile] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.MerchantProfilesTableName, _.id.raw)

private[tables] def initializeDeliveryMerchantProfilesTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, merchantProfilesDeliveryTable)

private[tables] def loadPersistedMerchantProfiles(connection: Connection): IO[List[MerchantProfile]] =
  loadEntityRows(connection, merchantProfilesDeliveryTable)

private[tables] def replacePersistedMerchantProfiles(
    connection: Connection,
    merchantProfiles: List[MerchantProfile],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, merchantProfilesDeliveryTable, merchantProfiles, updatedAt)
