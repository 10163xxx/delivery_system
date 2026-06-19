package services.auth.tables

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import services.auth.tables.accounts.*
import services.auth.tables.sessions.*

import java.sql.Connection

def initializeAuthTables(connection: Connection): IO[Unit] =
  initializeAuthAccountsTable(connection) *> initializeAuthSessionsTable(connection)
