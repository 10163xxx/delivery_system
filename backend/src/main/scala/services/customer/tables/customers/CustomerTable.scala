package services.customer.tables.customers

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.customer.objects.Customer
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val customerTable: DeliveryEntityTable[Customer] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.CustomersTableName, _.id.raw)

private[tables] def initializeCustomerTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, customerTable)

private[tables] def loadPersistedCustomers(connection: Connection): IO[List[Customer]] =
  loadEntityRows(connection, customerTable)

private[tables] def replacePersistedCustomers(
    connection: Connection,
    customers: List[Customer],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, customerTable, customers, updatedAt)
