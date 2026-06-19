package services.rider.tables

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import services.rider.objects.Rider
import services.rider.tables.riders.*

import java.sql.{Connection, Timestamp}

def initializeRiderTables(connection: Connection): IO[Unit] =
  initializeRiderTable(connection)

def loadPersistedRiderState(connection: Connection): IO[List[Rider]] =
  loadPersistedRiders(connection)

def replacePersistedRiderState(
    connection: Connection,
    riders: List[Rider],
    updatedAt: Timestamp,
): Unit =
  replacePersistedRiders(connection, riders, updatedAt)
