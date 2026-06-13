package services.admin.tables

import cats.effect.IO
import domain.admin.{AdminProfile, AdminTicket, PersistedAdminState}

import java.sql.{Connection, Timestamp}

def initializeAdminTables(connection: Connection): IO[Unit] =
  List(
    initializeDeliveryAdminsTable(connection),
    initializeDeliveryTicketsTable(connection),
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
