package services.rider.tables

import cats.effect.IO
import domain.rider.Rider

import java.sql.{Connection, Timestamp}

def initializeRiderTables(connection: Connection): IO[Unit] =
  initializeDeliveryRidersTable(connection)

def loadPersistedRiderState(connection: Connection): IO[List[Rider]] =
  loadPersistedRiders(connection)

def replacePersistedRiderState(
    connection: Connection,
    riders: List[Rider],
    updatedAt: Timestamp,
): Unit =
  replacePersistedRiders(connection, riders, updatedAt)
