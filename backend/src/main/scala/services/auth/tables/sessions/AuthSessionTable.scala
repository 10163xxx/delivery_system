package services.auth.tables.sessions

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import services.auth.objects.{AuthUserId, SessionToken}
import system.jdbc.*
import system.objects.*

import java.sql.{Connection, Timestamp}
import java.time.Instant

private val initAuthSessionsTableSql: SqlStatement =
  new SqlStatement(s"""
      |create table if not exists ${AuthPersistenceDefaults.SessionsTableName.raw} (
      |  ${AuthPersistenceDefaults.SessionTokenColumnName.raw} varchar(${AuthPersistenceDefaults.EntityIdColumnLength}) primary key,
      |  ${AuthPersistenceDefaults.SessionAccountIdColumnName.raw} varchar(${AuthPersistenceDefaults.EntityIdColumnLength}) not null references ${AuthPersistenceDefaults.AccountsTableName.raw}(${AuthPersistenceDefaults.AccountIdColumnName.raw}) on delete cascade,
      |  ${AuthPersistenceDefaults.CreatedAtColumnName.raw} timestamptz not null
      |);
      |""".stripMargin)

private val insertSessionSql: SqlStatement =
  new SqlStatement(s"""
      |insert into ${AuthPersistenceDefaults.SessionsTableName.raw} (
      |  ${AuthPersistenceDefaults.SessionTokenColumnName.raw},
      |  ${AuthPersistenceDefaults.SessionAccountIdColumnName.raw},
      |  ${AuthPersistenceDefaults.CreatedAtColumnName.raw}
      |)
      |values (?, ?, ?)
      |""".stripMargin)

private val deleteSessionSql: SqlStatement =
  new SqlStatement(s"""
      |delete from ${AuthPersistenceDefaults.SessionsTableName.raw}
      |where ${AuthPersistenceDefaults.SessionTokenColumnName.raw} = ?
      |""".stripMargin)

private[tables] def initializeAuthSessionsTable(connection: Connection): IO[Unit] =
  executeStatement(connection, initAuthSessionsTableSql)

private[tables] def insertAuthSession(
    connection: Connection,
    token: SessionToken,
    accountId: AuthUserId,
    createdAt: IsoDateTime,
): IO[Unit] =
  IO.blocking {
    val statement = connection.prepareStatement(insertSessionSql.raw)
    try
      statement.setString(1, token.raw)
      statement.setString(2, accountId.raw)
      statement.setTimestamp(3, Timestamp.from(Instant.parse(createdAt.raw)))
      statement.executeUpdate()
      ()
    finally statement.close()
  }

private[tables] def deleteAuthSession(connection: Connection, token: SessionToken): IO[Unit] =
  IO.blocking {
    val statement = connection.prepareStatement(deleteSessionSql.raw)
    try
      statement.setString(1, token.raw)
      statement.executeUpdate()
      ()
    finally statement.close()
  }

private def executeStatement(connection: Connection, sql: SqlStatement): IO[Unit] =
  IO.blocking {
    val statement = connection.createStatement()
    try
      statement.execute(sql.raw)
      ()
    finally statement.close()
  }
