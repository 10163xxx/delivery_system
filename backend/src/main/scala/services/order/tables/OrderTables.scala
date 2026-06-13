package services.order.tables

import cats.effect.IO
import domain.order.OrderSummary

import java.sql.{Connection, Timestamp}

def initializeOrderTables(connection: Connection): IO[Unit] =
  initializeDeliveryOrdersTable(connection)

def loadPersistedOrderState(connection: Connection): IO[List[OrderSummary]] =
  loadPersistedOrders(connection)

def replacePersistedOrderState(
    connection: Connection,
    orders: List[OrderSummary],
    updatedAt: Timestamp,
): Unit =
  replacePersistedOrders(connection, orders, updatedAt)
