package services.auth.tables

import cats.effect.IO
import system.withTransactionConnection
import domain.auth.PersistedAuthAccount
import domain.shared.{AuthUserId, IsoDateTime, SessionToken, Username}

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
