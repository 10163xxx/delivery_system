package services.order.tables

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import services.order.objects.OrderSummary
import services.order.tables.orders.*

import java.sql.{Connection, Timestamp}

def initializeOrderTables(connection: Connection): IO[Unit] =
  initializeOrderTable(connection)

def loadPersistedOrderState(connection: Connection): IO[List[OrderSummary]] =
  loadPersistedOrders(connection)

def replacePersistedOrderState(
    connection: Connection,
    orders: List[OrderSummary],
    updatedAt: Timestamp,
): Unit =
  replacePersistedOrders(connection, orders, updatedAt)
