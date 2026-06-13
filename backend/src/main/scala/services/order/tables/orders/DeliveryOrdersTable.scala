package services.order.tables

import system.jdbc.*
import cats.effect.IO
import domain.order.OrderSummary
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val ordersDeliveryTable: DeliveryEntityTable[OrderSummary] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.OrdersTableName, _.id.raw)

private[tables] def initializeDeliveryOrdersTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, ordersDeliveryTable)

private[tables] def loadPersistedOrders(connection: Connection): IO[List[OrderSummary]] =
  loadEntityRows(connection, ordersDeliveryTable)

private[tables] def replacePersistedOrders(
    connection: Connection,
    orders: List[OrderSummary],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, ordersDeliveryTable, orders, updatedAt)
