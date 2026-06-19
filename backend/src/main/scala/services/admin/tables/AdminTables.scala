package services.admin.tables

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import services.admin.objects.{AdminProfile, AdminTicket, PersistedAdminState}
import services.admin.tables.admins.*
import services.admin.tables.tickets.*

import java.sql.{Connection, Timestamp}

def initializeAdminTables(connection: Connection): IO[Unit] =
  List(
    initializeAdminTable(connection),
    initializeTicketTable(connection),
  ).foldLeft(IO.unit)(_ *> _)

def loadPersistedAdminState(connection: Connection): IO[PersistedAdminState] =
  for
    admins <- loadPersistedAdmins(connection)
    tickets <- loadPersistedTickets(connection)
  yield PersistedAdminState(
    admins = admins,
    tickets = tickets,
  )

def replacePersistedAdminState(
    connection: Connection,
    admins: List[AdminProfile],
    tickets: List[AdminTicket],
    updatedAt: Timestamp,
): Unit =
  replacePersistedAdmins(connection, admins, updatedAt)
  replacePersistedTickets(connection, tickets, updatedAt)
