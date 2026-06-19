package services.customer.tables

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import services.customer.objects.Customer
import services.customer.tables.customers.*

import java.sql.{Connection, Timestamp}

def initializeCustomerTables(connection: Connection): IO[Unit] =
  initializeCustomerTable(connection)

def loadPersistedCustomerState(connection: Connection): IO[List[Customer]] =
  loadPersistedCustomers(connection)

def replacePersistedCustomerState(
    connection: Connection,
    customers: List[Customer],
    updatedAt: Timestamp,
): Unit =
  replacePersistedCustomers(connection, customers, updatedAt)
