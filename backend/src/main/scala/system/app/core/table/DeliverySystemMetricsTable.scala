package system.app.core.table

import domain.shared.given

import cats.effect.IO
import domain.shared.*
import system.jdbc.*

import java.sql.{Connection, Timestamp}

private val createMetricsTableSql: SqlStatement =
  new SqlStatement(s"""
      |create table if not exists ${DeliveryPersistenceDefaults.MetricsTableName.raw} (
      |  ${DeliveryPersistenceDefaults.StateKeyColumnName.raw} varchar(${DeliveryPersistenceDefaults.StateKeyColumnLength}) primary key,
      |  ${DeliveryPersistenceDefaults.PayloadColumnName.raw} jsonb not null,
      |  ${DeliveryPersistenceDefaults.UpdatedAtColumnName.raw} timestamptz not null
      |);
      |""".stripMargin)

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

def initializeDeliverySystemMetricsTable(connection: Connection): IO[Unit] =
  executeSqlStatement(connection, createMetricsTableSql)

def loadPersistedSystemMetrics(connection: Connection): IO[Option[SystemMetrics]] =
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

def upsertPersistedSystemMetrics(
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
