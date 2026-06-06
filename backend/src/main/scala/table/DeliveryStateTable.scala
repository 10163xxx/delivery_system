package table

import domain.shared.given

// Persistence adapter for the delivery demo state, storing each aggregate as JSONB rows.

import cats.effect.IO
import domain.admin.{AdminProfile, AdminTicket}
import domain.customer.Customer
import domain.merchant.{MerchantApplication, MerchantProfile, Store}
import domain.order.OrderSummary
import domain.review.{EligibilityReview, ReviewAppeal}
import domain.rider.Rider
import domain.shared.*
import io.circe.{Decoder, Encoder, Printer}
import io.circe.parser.decode
import io.circe.syntax.*

import java.sql.{Connection, PreparedStatement, ResultSet, Timestamp}
import java.time.Instant

private val deliveryStateJsonPrinter = Printer.noSpacesSortKeys
private val primaryStateKey = DeliveryPersistenceDefaults.PrimaryStateKey

private final case class DeliveryEntityTable(
    tableName: TableName,
)

private val customersTable = DeliveryEntityTable(DeliveryPersistenceDefaults.CustomersTableName)
private val storesTable = DeliveryEntityTable(DeliveryPersistenceDefaults.StoresTableName)
private val merchantProfilesTable = DeliveryEntityTable(DeliveryPersistenceDefaults.MerchantProfilesTableName)
private val ridersTable = DeliveryEntityTable(DeliveryPersistenceDefaults.RidersTableName)
private val adminsTable = DeliveryEntityTable(DeliveryPersistenceDefaults.AdminsTableName)
private val merchantApplicationsTable = DeliveryEntityTable(DeliveryPersistenceDefaults.MerchantApplicationsTableName)
private val reviewAppealsTable = DeliveryEntityTable(DeliveryPersistenceDefaults.ReviewAppealsTableName)
private val eligibilityReviewsTable = DeliveryEntityTable(DeliveryPersistenceDefaults.EligibilityReviewsTableName)
private val ordersTable = DeliveryEntityTable(DeliveryPersistenceDefaults.OrdersTableName)
private val ticketsTable = DeliveryEntityTable(DeliveryPersistenceDefaults.TicketsTableName)

private val entityTables = List(
  customersTable,
  storesTable,
  merchantProfilesTable,
  ridersTable,
  adminsTable,
  merchantApplicationsTable,
  reviewAppealsTable,
  eligibilityReviewsTable,
  ordersTable,
  ticketsTable,
)

private val createMetricsTableSql: SqlStatement =
  new SqlStatement(s"""
      |create table if not exists ${DeliveryPersistenceDefaults.MetricsTableName.raw} (
      |  ${DeliveryPersistenceDefaults.StateKeyColumnName.raw} varchar(${DeliveryPersistenceDefaults.StateKeyColumnLength}) primary key,
      |  ${DeliveryPersistenceDefaults.PayloadColumnName.raw} jsonb not null,
      |  ${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw} timestamptz not null
      |);
      |""".stripMargin)

private def createEntityTableSql(table: DeliveryEntityTable): SqlStatement =
  new SqlStatement(s"""
      |create table if not exists ${table.tableName.raw} (
      |  ${DeliveryPersistenceDefaults.EntityIdColumnName.raw} varchar(${DeliveryPersistenceDefaults.EntityIdColumnLength}) primary key,
      |  ${DeliveryPersistenceDefaults.PositionColumnName.raw} integer not null,
      |  ${DeliveryPersistenceDefaults.PayloadColumnName.raw} jsonb not null,
      |  ${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw} timestamptz not null
      |);
      |""".stripMargin)

private val insertEntityRowSqlByTable = entityTables.map(table =>
  table.tableName -> new SqlStatement(s"""
      |insert into ${table.tableName.raw} (
      |  ${DeliveryPersistenceDefaults.EntityIdColumnName.raw},
      |  ${DeliveryPersistenceDefaults.PositionColumnName.raw},
      |  ${DeliveryPersistenceDefaults.PayloadColumnName.raw},
      |  ${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw}
      |) values (?, ?, cast(? as jsonb), ?)
      |""".stripMargin)
).toMap

private val deleteEntityRowsSqlByTable = entityTables.map(table =>
  table.tableName -> new SqlStatement(s"delete from ${table.tableName.raw}")
).toMap

private val loadEntityRowsSqlByTable = entityTables.map(table =>
  table.tableName -> new SqlStatement(s"""
      |select ${DeliveryPersistenceDefaults.PayloadColumnName.raw}::text
      |from ${table.tableName.raw}
      |order by ${DeliveryPersistenceDefaults.PositionColumnName.raw} asc
      |""".stripMargin)
).toMap

private val upsertMetricsSql: SqlStatement =
  new SqlStatement(s"""
      |insert into ${DeliveryPersistenceDefaults.MetricsTableName.raw} (
      |  ${DeliveryPersistenceDefaults.StateKeyColumnName.raw},
      |  ${DeliveryPersistenceDefaults.PayloadColumnName.raw},
      |  ${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw}
      |) values (?, cast(? as jsonb), ?)
      |on conflict (${DeliveryPersistenceDefaults.StateKeyColumnName.raw})
      |do update set
      |  ${DeliveryPersistenceDefaults.PayloadColumnName.raw} = excluded.${DeliveryPersistenceDefaults.PayloadColumnName.raw},
      |  ${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw} = excluded.${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw}
      |""".stripMargin)

private val loadMetricsSql: SqlStatement =
  new SqlStatement(s"""
      |select ${DeliveryPersistenceDefaults.PayloadColumnName.raw}::text
      |from ${DeliveryPersistenceDefaults.MetricsTableName.raw}
      |where ${DeliveryPersistenceDefaults.StateKeyColumnName.raw} = ?
      |""".stripMargin)

private val loadSnapshotDeliveryStateSql: SqlStatement =
  new SqlStatement(s"""
      |select ${DeliveryPersistenceDefaults.SnapshotStateJsonColumnName.raw}::text
      |from ${DeliveryPersistenceDefaults.SnapshotTableName.raw}
      |where ${DeliveryPersistenceDefaults.StateKeyColumnName.raw} = ?
      |""".stripMargin)

def initializeDeliveryStateTable(connection: Connection): IO[Unit] =
  entityTables.foldLeft(IO.unit) { (acc, table) =>
    acc *> executeSqlStatement(connection, createEntityTableSql(table))
  } *> executeSqlStatement(connection, createMetricsTableSql)

def loadPersistedDeliveryState(connection: Connection): IO[Option[DeliveryAppState]] =
  loadSplitPersistedDeliveryState(connection).flatMap {
    case some @ Some(_) => IO.pure(some)
    case None => loadSnapshotPersistedDeliveryState(connection)
  }

def savePersistedDeliveryState(connection: Connection, state: DeliveryAppState): IO[Unit] =
  IO.blocking(savePersistedDeliveryStateBlocking(connection, state))

def savePersistedDeliveryStateBlocking(connection: Connection, state: DeliveryAppState): Unit =
  val updatedAt = Timestamp.from(Instant.now())
  replaceEntityRows(connection, customersTable, state.customers, _.id.raw, updatedAt)
  replaceEntityRows(connection, storesTable, state.stores, _.id.raw, updatedAt)
  replaceEntityRows(connection, merchantProfilesTable, state.merchantProfiles, _.id.raw, updatedAt)
  replaceEntityRows(connection, ridersTable, state.riders, _.id.raw, updatedAt)
  replaceEntityRows(connection, adminsTable, state.admins, _.id.raw, updatedAt)
  replaceEntityRows(connection, merchantApplicationsTable, state.merchantApplications, _.id.raw, updatedAt)
  replaceEntityRows(connection, reviewAppealsTable, state.reviewAppeals, _.id.raw, updatedAt)
  replaceEntityRows(connection, eligibilityReviewsTable, state.eligibilityReviews, _.id.raw, updatedAt)
  replaceEntityRows(connection, ordersTable, state.orders, _.id.raw, updatedAt)
  replaceEntityRows(connection, ticketsTable, state.tickets, _.id.raw, updatedAt)
  upsertMetricsRow(connection, state.metrics, updatedAt)

private def loadSplitPersistedDeliveryState(connection: Connection): IO[Option[DeliveryAppState]] =
  loadMetricsRow(connection).flatMap {
    case None => IO.pure(None)
    case Some(metrics) =>
      for
        customers <- loadEntityRows[Customer](connection, customersTable)
        stores <- loadEntityRows[Store](connection, storesTable)
        merchantProfiles <- loadEntityRows[MerchantProfile](connection, merchantProfilesTable)
        riders <- loadEntityRows[Rider](connection, ridersTable)
        admins <- loadEntityRows[AdminProfile](connection, adminsTable)
        merchantApplications <- loadEntityRows[MerchantApplication](connection, merchantApplicationsTable)
        reviewAppeals <- loadEntityRows[ReviewAppeal](connection, reviewAppealsTable)
        eligibilityReviews <- loadEntityRows[EligibilityReview](connection, eligibilityReviewsTable)
        orders <- loadEntityRows[OrderSummary](connection, ordersTable)
        tickets <- loadEntityRows[AdminTicket](connection, ticketsTable)
      yield Some(
        DeliveryAppState(
          customers = customers,
          stores = stores,
          merchantProfiles = merchantProfiles,
          riders = riders,
          admins = admins,
          merchantApplications = merchantApplications,
          reviewAppeals = reviewAppeals,
          eligibilityReviews = eligibilityReviews,
          orders = orders,
          tickets = tickets,
          metrics = metrics,
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
          if resultSet.next() then Some(decodeJsonRow[DeliveryAppState](readJsonPayload(resultSet, 1), DeliveryPersistenceDefaults.SnapshotTableName))
          else None
        finally resultSet.close()
      finally statement.close()
    }
  else IO.pure(None)

private def loadEntityRows[A: Decoder](
    connection: Connection,
    table: DeliveryEntityTable,
): IO[List[A]] =
  IO.blocking {
    val statement = connection.prepareStatement(loadEntityRowsSqlByTable(table.tableName).raw)
    try
      val resultSet = statement.executeQuery()
      try
        Iterator
          .continually(resultSet.next())
          .takeWhile(identity)
          .map(_ => decodeJsonRow[A](readJsonPayload(resultSet, 1), table.tableName))
          .toList
      finally resultSet.close()
    finally statement.close()
  }

private def replaceEntityRows[A: Encoder](
    connection: Connection,
    table: DeliveryEntityTable,
    values: List[A],
    entityIdOf: A => EntityId,
    updatedAt: Timestamp,
): Unit =
  executeBlockingSqlStatement(connection, deleteEntityRowsSqlByTable(table.tableName))

  val insertStatement = connection.prepareStatement(insertEntityRowSqlByTable(table.tableName).raw)
  try
    values.zipWithIndex.foreach { case (value, index) =>
      insertStatement.setString(1, entityIdOf(value).raw)
      insertStatement.setInt(2, index)
      insertStatement.setString(3, renderJsonPayload(value).raw)
      insertStatement.setTimestamp(4, updatedAt)
      insertStatement.addBatch()
    }
    insertStatement.executeBatch()
    ()
  finally insertStatement.close()

private def loadMetricsRow(connection: Connection): IO[Option[SystemMetrics]] =
  IO.blocking {
    val statement = connection.prepareStatement(loadMetricsSql.raw)
    try
      statement.setString(1, primaryStateKey.raw)
      val resultSet = statement.executeQuery()
      try
        if resultSet.next() then Some(decodeJsonRow[SystemMetrics](readJsonPayload(resultSet, 1), DeliveryPersistenceDefaults.MetricsTableName))
        else None
      finally resultSet.close()
    finally statement.close()
  }

private def upsertMetricsRow(
    connection: Connection,
    metrics: SystemMetrics,
    updatedAt: Timestamp,
): Unit =
  val statement = connection.prepareStatement(upsertMetricsSql.raw)
  try
    statement.setString(1, primaryStateKey.raw)
    statement.setString(2, renderJsonPayload(metrics).raw)
    statement.setTimestamp(3, updatedAt)
    statement.executeUpdate()
    ()
  finally statement.close()

private def executeSqlStatement(connection: Connection, sql: SqlStatement): IO[Unit] =
  IO.blocking(executeBlockingSqlStatement(connection, sql))

private def executeBlockingSqlStatement(connection: Connection, sql: SqlStatement): Unit =
  val statement = connection.createStatement()
  try
    statement.execute(sql.raw)
    ()
  finally statement.close()

private def tableExists(connection: Connection, tableName: TableName): Boolean =
  val metaData = connection.getMetaData
  val resultSet = metaData.getTables(null, null, tableName.raw, Array("TABLE"))
  try resultSet.next()
  finally resultSet.close()

private def readJsonPayload(resultSet: ResultSet, columnIndex: Int): JsonPayload =
  new JsonPayload(resultSet.getString(columnIndex))

private def renderJsonPayload[A: Encoder](value: A): JsonPayload =
  new JsonPayload(deliveryStateJsonPrinter.print(value.asJson))

private def decodeJsonRow[A: Decoder](rawJson: JsonPayload, tableName: TableName): A =
  decode[A](rawJson.raw).fold(
    error =>
      throw IllegalStateException(
        s"无法解析数据库中的业务状态 ${tableName.raw}: ${error.getMessage}",
        error,
      ),
    identity,
  )
