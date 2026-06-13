package services.customer.tables

import system.jdbc.*
import cats.effect.IO
import domain.customer.Customer
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val customersDeliveryTable: DeliveryEntityTable[Customer] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.CustomersTableName, _.id.raw)

private[tables] def initializeDeliveryCustomersTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, customersDeliveryTable)

private[tables] def loadPersistedCustomers(connection: Connection): IO[List[Customer]] =
  loadEntityRows(connection, customersDeliveryTable)

private[tables] def replacePersistedCustomers(
    connection: Connection,
    customers: List[Customer],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, customersDeliveryTable, customers, updatedAt)
