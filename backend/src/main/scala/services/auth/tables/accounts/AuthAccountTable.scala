package services.auth.tables.accounts

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import system.objects.given

import cats.effect.IO
import services.auth.objects.*
import system.jdbc.*
import system.objects.*

import java.sql.{Connection, PreparedStatement, ResultSet}

private val roleCheckValues = UserRole.values.map(role => s"'${UserRole.render(role).raw}'").mkString(", ")

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

private[tables] def initializeAuthAccountsTable(connection: Connection): IO[Unit] =
  executeStatement(connection, initAuthAccountsTableSql)

private[tables] def insertAuthAccount(connection: Connection, account: PersistedAuthAccount): IO[Unit] =
  IO.blocking {
    val statement = connection.prepareStatement(insertAccountSql.raw)
    try setAuthAccountParameters(statement, account)
    finally statement.close()
  }

private[tables] def findAuthAccountByUsername(connection: Connection, username: Username): IO[Option[PersistedAuthAccount]] =
  IO.blocking {
    val statement = connection.prepareStatement(findAccountByUsernameSql.raw)
    try
      statement.setString(1, username.raw)
      val resultSet = statement.executeQuery()
      try
        if resultSet.next() then readAuthAccount(resultSet).map(Some(_))
        else Right(None)
      finally resultSet.close()
    finally statement.close()
  }.flatMap(IO.fromEither)

private[tables] def findAuthAccountBySessionToken(connection: Connection, token: SessionToken): IO[Option[PersistedAuthAccount]] =
  IO.blocking {
    val statement = connection.prepareStatement(findAccountBySessionTokenSql.raw)
    try
      statement.setString(1, token.raw)
      val resultSet = statement.executeQuery()
      try
        if resultSet.next() then readAuthAccount(resultSet).map(Some(_))
        else Right(None)
      finally resultSet.close()
    finally statement.close()
  }.flatMap(IO.fromEither)

private def executeStatement(connection: Connection, sql: SqlStatement): IO[Unit] =
  IO.blocking {
    val statement = connection.createStatement()
    try
      statement.execute(sql.raw)
      ()
    finally statement.close()
  }

private def setAuthAccountParameters(statement: PreparedStatement, account: PersistedAuthAccount): Unit =
  setWrappedText(statement, new ParameterIndex(1), account.id)
  setWrappedText(statement, new ParameterIndex(2), account.username)
  setWrappedText(statement, new ParameterIndex(3), account.passwordHash)
  setUserRole(statement, new ParameterIndex(4), account.role)
  setWrappedText(statement, new ParameterIndex(5), account.displayName)
  setOptionalWrappedText(statement, new ParameterIndex(6), account.linkedProfileId)
  setIsoDateTime(statement, new ParameterIndex(7), account.createdAt)
  statement.executeUpdate()
  ()

private def readAuthAccount(resultSet: ResultSet): Either[IllegalStateException, PersistedAuthAccount] =
  readUserRole(resultSet, AuthPersistenceDefaults.RoleColumnName).map(role =>
    PersistedAuthAccount(
      id = readWrappedText[AuthUserId](resultSet, AuthPersistenceDefaults.AccountIdColumnName),
      username = readWrappedText[Username](resultSet, AuthPersistenceDefaults.UsernameColumnName),
      passwordHash = readWrappedText[PasswordHash](resultSet, AuthPersistenceDefaults.PasswordHashColumnName),
      role = role,
      displayName = readWrappedText[PersonName](resultSet, AuthPersistenceDefaults.DisplayNameColumnName),
      linkedProfileId = readOptionalWrappedText[EntityId](resultSet, AuthPersistenceDefaults.LinkedProfileIdColumnName),
      createdAt = readIsoDateTime(resultSet, AuthPersistenceDefaults.CreatedAtColumnName),
    )
  )
