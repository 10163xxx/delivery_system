package services.order.tables.orders

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.order.objects.OrderSummary
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val orderTable: DeliveryEntityTable[OrderSummary] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.OrdersTableName, _.id.raw)

private[tables] def initializeOrderTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, orderTable)

private[tables] def loadPersistedOrders(connection: Connection): IO[List[OrderSummary]] =
  loadEntityRows(connection, orderTable)

private[tables] def replacePersistedOrders(
    connection: Connection,
    orders: List[OrderSummary],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, orderTable, orders, updatedAt)
