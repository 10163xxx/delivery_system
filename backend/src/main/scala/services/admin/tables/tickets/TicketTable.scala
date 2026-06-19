package services.admin.tables.tickets

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.jdbc.*
import cats.effect.IO
import services.admin.objects.AdminTicket
import system.objects.DeliveryPersistenceDefaults

import java.sql.{Connection, Timestamp}

private val ticketTable: DeliveryEntityTable[AdminTicket] =
  DeliveryEntityTable(DeliveryPersistenceDefaults.TicketsTableName, _.id.raw)

private[tables] def initializeTicketTable(connection: Connection): IO[Unit] =
  initializeEntityTable(connection, ticketTable)

private[tables] def loadPersistedTickets(connection: Connection): IO[List[AdminTicket]] =
  loadEntityRows(connection, ticketTable)

private[tables] def replacePersistedTickets(
    connection: Connection,
    tickets: List[AdminTicket],
    updatedAt: Timestamp,
): Unit =
  replaceEntityRows(connection, ticketTable, tickets, updatedAt)
