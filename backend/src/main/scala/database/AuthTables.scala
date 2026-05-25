package database

import domain.shared.given

import cats.effect.IO
import domain.auth.AuthAccount
import domain.shared.*

import java.sql.{Connection, PreparedStatement, ResultSet, Timestamp}
import java.time.Instant

private val roleCheckValues = UserRole.values.map(role => s"'${role.toString}'").mkString(", ")

private val initAuthAccountsTableSql: SqlStatement =
  new SqlStatement(s"""
      |create table if not exists ${AuthPersistenceDefaults.AccountsTableName.raw} (
      |  ${AuthPersistenceDefaults.AccountIdColumnName.raw} varchar(${AuthPersistenceDefaults.EntityIdColumnLength}) primary key,
      |  ${AuthPersistenceDefaults.UsernameColumnName.raw} varchar(${AuthDefaults.UsernameMaxLength}) not null unique,
      |  ${AuthPersistenceDefaults.PasswordHashColumnName.raw} varchar(${AuthPersistenceDefaults.PasswordHashColumnLength}) not null,
      |  ${AuthPersistenceDefaults.RoleColumnName.raw} varchar(${AuthPersistenceDefaults.RoleColumnLength}) not null check (role in ($roleCheckValues)),
      |  ${AuthPersistenceDefaults.DisplayNameColumnName.raw} varchar(${AuthPersistenceDefaults.DisplayNameColumnLength}) not null,
      |  ${AuthPersistenceDefaults.LinkedProfileIdColumnName.raw} varchar(${AuthPersistenceDefaults.EntityIdColumnLength}),
      |  ${AuthPersistenceDefaults.CreatedAtColumnName.raw} timestamptz not null
      |);
      |""".stripMargin)

private val initAuthSessionsTableSql: SqlStatement =
  new SqlStatement(s"""
      |create table if not exists ${AuthPersistenceDefaults.SessionsTableName.raw} (
      |  ${AuthPersistenceDefaults.SessionTokenColumnName.raw} varchar(${AuthPersistenceDefaults.EntityIdColumnLength}) primary key,
      |  ${AuthPersistenceDefaults.SessionAccountIdColumnName.raw} varchar(${AuthPersistenceDefaults.EntityIdColumnLength}) not null references ${AuthPersistenceDefaults.AccountsTableName.raw}(${AuthPersistenceDefaults.AccountIdColumnName.raw}) on delete cascade,
      |  ${AuthPersistenceDefaults.CreatedAtColumnName.raw} timestamptz not null
      |);
      |""".stripMargin)

private val insertAccountSql: SqlStatement =
  new SqlStatement(s"""
      |insert into ${AuthPersistenceDefaults.AccountsTableName.raw} (
      |  ${AuthPersistenceDefaults.AccountIdColumnName.raw},
      |  ${AuthPersistenceDefaults.UsernameColumnName.raw},
      |  ${AuthPersistenceDefaults.PasswordHashColumnName.raw},
      |  ${AuthPersistenceDefaults.RoleColumnName.raw},
      |  ${AuthPersistenceDefaults.DisplayNameColumnName.raw},
      |  ${AuthPersistenceDefaults.LinkedProfileIdColumnName.raw},
      |  ${AuthPersistenceDefaults.CreatedAtColumnName.raw}
      |) values (?, ?, ?, ?, ?, ?, ?)
      |""".stripMargin)

private val findAccountByUsernameSql: SqlStatement =
  new SqlStatement(s"""
      |select
      |  ${AuthPersistenceDefaults.AccountIdColumnName.raw},
      |  ${AuthPersistenceDefaults.UsernameColumnName.raw},
      |  ${AuthPersistenceDefaults.PasswordHashColumnName.raw},
      |  ${AuthPersistenceDefaults.RoleColumnName.raw},
      |  ${AuthPersistenceDefaults.DisplayNameColumnName.raw},
      |  ${AuthPersistenceDefaults.LinkedProfileIdColumnName.raw},
      |  ${AuthPersistenceDefaults.CreatedAtColumnName.raw}
      |from ${AuthPersistenceDefaults.AccountsTableName.raw}
      |where ${AuthPersistenceDefaults.UsernameColumnName.raw} = ?
      |""".stripMargin)

private val findAccountBySessionTokenSql: SqlStatement =
  new SqlStatement(s"""
      |select
      |  a.${AuthPersistenceDefaults.AccountIdColumnName.raw},
      |  a.${AuthPersistenceDefaults.UsernameColumnName.raw},
      |  a.${AuthPersistenceDefaults.PasswordHashColumnName.raw},
      |  a.${AuthPersistenceDefaults.RoleColumnName.raw},
      |  a.${AuthPersistenceDefaults.DisplayNameColumnName.raw},
      |  a.${AuthPersistenceDefaults.LinkedProfileIdColumnName.raw},
      |  a.${AuthPersistenceDefaults.CreatedAtColumnName.raw}
      |from ${AuthPersistenceDefaults.AccountsTableName.raw} a
      |join ${AuthPersistenceDefaults.SessionsTableName.raw} s on s.${AuthPersistenceDefaults.SessionAccountIdColumnName.raw} = a.${AuthPersistenceDefaults.AccountIdColumnName.raw}
      |where s.${AuthPersistenceDefaults.SessionTokenColumnName.raw} = ?
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

def initializeAuthTables(connection: Connection): IO[Unit] =
  executeStatement(connection, initAuthAccountsTableSql) *> executeStatement(connection, initAuthSessionsTableSql)

def insertAuthAccount(connection: Connection, account: AuthAccount): IO[Unit] =
  IO.blocking {
    val statement = connection.prepareStatement(insertAccountSql.raw)
    try setAuthAccountParameters(statement, account)
    finally statement.close()
  }

def findAuthAccountByUsername(connection: Connection, username: Username): IO[Option[AuthAccount]] =
  IO.blocking {
    val statement = connection.prepareStatement(findAccountByUsernameSql.raw)
    try
      statement.setString(1, username.raw)
      val resultSet = statement.executeQuery()
      try
        if resultSet.next() then Some(readAuthAccount(resultSet))
        else None
      finally resultSet.close()
    finally statement.close()
  }

def findAuthAccountBySessionToken(connection: Connection, token: SessionToken): IO[Option[AuthAccount]] =
  IO.blocking {
    val statement = connection.prepareStatement(findAccountBySessionTokenSql.raw)
    try
      statement.setString(1, token.raw)
      val resultSet = statement.executeQuery()
      try
        if resultSet.next() then Some(readAuthAccount(resultSet))
        else None
      finally resultSet.close()
    finally statement.close()
  }

def insertAuthSession(
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

def deleteAuthSession(connection: Connection, token: SessionToken): IO[Unit] =
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

private def setAuthAccountParameters(statement: PreparedStatement, account: AuthAccount): Unit =
  statement.setString(1, account.id.raw)
  statement.setString(2, account.username.raw)
  statement.setString(3, account.passwordHash.raw)
  statement.setString(4, account.role.toString)
  statement.setString(5, account.displayName.raw)
  statement.setString(6, account.linkedProfileId.map(_.raw).orNull)
  statement.setTimestamp(7, Timestamp.from(Instant.parse(account.createdAt.raw)))
  statement.executeUpdate()
  ()

private def readAuthAccount(resultSet: ResultSet): AuthAccount =
  AuthAccount(
    id = wrapText[AuthUserId](resultSet.getString(AuthPersistenceDefaults.AccountIdColumnName.raw)),
    username = new Username(resultSet.getString(AuthPersistenceDefaults.UsernameColumnName.raw)),
    passwordHash = new PasswordHash(resultSet.getString(AuthPersistenceDefaults.PasswordHashColumnName.raw)),
    role = UserRole.valueOf(resultSet.getString(AuthPersistenceDefaults.RoleColumnName.raw)),
    displayName = new PersonName(resultSet.getString(AuthPersistenceDefaults.DisplayNameColumnName.raw)),
    linkedProfileId = Option(resultSet.getString(AuthPersistenceDefaults.LinkedProfileIdColumnName.raw)).map(wrapText[EntityId]),
    createdAt = new IsoDateTime(resultSet.getTimestamp(AuthPersistenceDefaults.CreatedAtColumnName.raw).toInstant.toString),
  )
