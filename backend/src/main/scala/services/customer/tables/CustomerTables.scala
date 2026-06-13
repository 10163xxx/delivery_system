package services.customer.tables

import cats.effect.IO
import domain.customer.Customer

import java.sql.{Connection, Timestamp}

def initializeCustomerTables(connection: Connection): IO[Unit] =
  initializeDeliveryCustomersTable(connection)

def loadPersistedCustomerState(connection: Connection): IO[List[Customer]] =
  loadPersistedCustomers(connection)

def replacePersistedCustomerState(
    connection: Connection,
    customers: List[Customer],
    updatedAt: Timestamp,
): Unit =
  replacePersistedCustomers(connection, customers, updatedAt)
