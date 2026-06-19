package services.admin.tables.admins

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.admin.objects.AdminProfile
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val adminTable: DeliveryEntityTable[AdminProfile] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.AdminsTableName, _.id.raw)

private[tables] def initializeAdminTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, adminTable)

private[tables] def loadPersistedAdmins(connection: Connection): IO[List[AdminProfile]] =
  loadEntityRows(connection, adminTable)

private[tables] def replacePersistedAdmins(
    connection: Connection,
    admins: List[AdminProfile],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, adminTable, admins, updatedAt)
