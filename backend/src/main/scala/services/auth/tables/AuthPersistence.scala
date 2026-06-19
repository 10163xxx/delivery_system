package services.auth.tables

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import system.withTransactionConnection
import services.auth.objects.PersistedAuthAccount
import services.auth.tables.accounts.*
import services.auth.tables.sessions.*
import system.objects.{IsoDateTime}
import services.auth.objects.{AuthUserId, SessionToken, Username}

def initializeAuthPersistenceData: IO[Unit] =
  withTransactionConnection { connection =>
    initializeAuthTables(connection)
  }

def findPersistedAuthAccountByUsername(username: Username): IO[Option[PersistedAuthAccount]] =
  withTransactionConnection(connection => findAuthAccountByUsername(connection, username))

def findPersistedAuthAccountBySessionToken(token: SessionToken): IO[Option[PersistedAuthAccount]] =
  withTransactionConnection(connection => findAuthAccountBySessionToken(connection, token))

def createPersistedAuthSession(
    token: SessionToken,
    accountId: AuthUserId,
    createdAt: IsoDateTime,
): IO[Unit] =
  withTransactionConnection(connection => insertAuthSession(connection, token, accountId, createdAt))

def createPersistedAuthAccountWithSession(
    account: PersistedAuthAccount,
    token: SessionToken,
    createdAt: IsoDateTime,
): IO[Unit] =
  withTransactionConnection { connection =>
    insertAuthAccount(connection, account) *> insertAuthSession(connection, token, account.id, createdAt)
  }

def deletePersistedAuthSession(token: SessionToken): IO[Unit] =
  withTransactionConnection(connection => deleteAuthSession(connection, token))
