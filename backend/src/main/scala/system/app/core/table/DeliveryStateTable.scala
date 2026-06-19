package system.app.core.table

// Business note: application-level business orchestration and derived state shared by service actions.
import system.objects.given
import system.app.objects.*

import cats.effect.IO
import services.admin.tables.*
import services.customer.tables.*
import system.objects.*
import services.merchant.tables.*
import services.order.tables.*
import services.review.tables.*
import services.rider.tables.*
import system.jdbc.*

import java.sql.{Connection, Timestamp}
import java.time.Instant

private val loadSnapshotDeliveryStateSql: SqlStatement =
  new SqlStatement(s"""
      |select ${DeliveryPersistenceDefaults.SnapshotStateJsonColumnName.raw}::text
      |from ${DeliveryPersistenceDefaults.SnapshotTableName.raw}
      |where ${DeliveryPersistenceDefaults.StateKeyColumnName.raw} = ?
      |""".stripMargin)

def initializeDeliveryStateTable(connection: Connection): IO[Unit] =
  List(
    initializeCustomerTables(connection),
    initializeMerchantTables(connection),
    initializeRiderTables(connection),
    initializeAdminTables(connection),
    initializeReviewTables(connection),
    initializeOrderTables(connection),
    initializeDeliverySystemMetricsTable(connection),
  ).foldLeft(IO.unit)(_ *> _)

def loadPersistedDeliveryState(connection: Connection): IO[Option[DeliveryAppState]] =
  loadSplitPersistedDeliveryState(connection).flatMap {
    case some @ Some(_) => IO.pure(some)
    case None => loadSnapshotPersistedDeliveryState(connection)
  }

def savePersistedDeliveryState(connection: Connection, state: DeliveryAppState): IO[Unit] =
  IO.blocking(savePersistedDeliveryStateBlocking(connection, state))

def savePersistedDeliveryStateBlocking(connection: Connection, state: DeliveryAppState): Unit =
  val updatedAt = Timestamp.from(Instant.now())
  replacePersistedCustomerState(connection, state.customers, updatedAt)
  replacePersistedMerchantState(
    connection,
    state.stores,
    state.merchantProfiles,
    state.merchantApplications,
    updatedAt,
  )
  replacePersistedRiderState(connection, state.riders, updatedAt)
  replacePersistedAdminState(connection, state.admins, state.tickets, updatedAt)
  replacePersistedReviewState(
    connection,
    state.reviewAppeals,
    state.eligibilityReviews,
    updatedAt,
  )
  replacePersistedOrderState(connection, state.orders, updatedAt)
  upsertPersistedSystemMetrics(connection, state.metrics, updatedAt)

private def loadSplitPersistedDeliveryState(connection: Connection): IO[Option[DeliveryAppState]] =
  loadPersistedSystemMetrics(connection).flatMap {
    case None => IO.pure(None)
    case Some(metrics) =>
      for
        customers <- loadPersistedCustomerState(connection)
        merchantState <- loadPersistedMerchantState(connection)
        riders <- loadPersistedRiderState(connection)
        adminState <- loadPersistedAdminState(connection)
        reviewState <- loadPersistedReviewState(connection)
        orders <- loadPersistedOrderState(connection)
      yield Some(
        DeliveryAppState(
          customers = customers,
          stores = merchantState.stores,
          merchantProfiles = merchantState.merchantProfiles,
          riders = riders,
          admins = adminState.admins,
          merchantApplications = merchantState.merchantApplications,
          reviewAppeals = reviewState.reviewAppeals,
          eligibilityReviews = reviewState.eligibilityReviews,
          deliveryState = DeliveryOrderState(
            orders = orders,
            tickets = adminState.tickets,
            metrics = metrics,
          ),
        )
      )
  }

private def loadSnapshotPersistedDeliveryState(connection: Connection): IO[Option[DeliveryAppState]] =
  if tableExists(connection, DeliveryPersistenceDefaults.SnapshotTableName) then
    IO.blocking {
      val statement = connection.prepareStatement(loadSnapshotDeliveryStateSql.raw)
      try
        statement.setString(1, primaryStateKey.raw)
        val resultSet = statement.executeQuery()
        try
          if resultSet.next() then
            decodeJsonRow[DeliveryAppState](readJsonPayload(resultSet, 1), DeliveryPersistenceDefaults.SnapshotTableName)
              .map(Some(_))
          else Right(None)
        finally resultSet.close()
      finally statement.close()
    }.flatMap(IO.fromEither)
  else IO.pure(None)
