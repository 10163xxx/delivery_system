package services.admin.tables

import system.jdbc.*
import cats.effect.IO
import domain.admin.AdminProfile
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val adminsDeliveryTable: DeliveryEntityTable[AdminProfile] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.AdminsTableName, _.id.raw)

private[tables] def initializeDeliveryAdminsTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, adminsDeliveryTable)

private[tables] def loadPersistedAdmins(connection: Connection): IO[List[AdminProfile]] =
  loadEntityRows(connection, adminsDeliveryTable)

private[tables] def replacePersistedAdmins(
    connection: Connection,
    admins: List[AdminProfile],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, adminsDeliveryTable, admins, updatedAt)
