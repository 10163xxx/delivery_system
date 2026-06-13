package services.admin.tables

import system.jdbc.*
import cats.effect.IO
import domain.admin.AdminTicket
import domain.shared.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val ticketsDeliveryTable: DeliveryEntityTable[AdminTicket] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.TicketsTableName, _.id.raw)

private[tables] def initializeDeliveryTicketsTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, ticketsDeliveryTable)

private[tables] def loadPersistedTickets(connection: Connection): IO[List[AdminTicket]] =
  loadEntityRows(connection, ticketsDeliveryTable)

private[tables] def replacePersistedTickets(
    connection: Connection,
    tickets: List[AdminTicket],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, ticketsDeliveryTable, tickets, updatedAt)
