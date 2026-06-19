package services.merchant.tables

// Business note: database boundary for this service; keep JDBC row mapping separate from protocol DTOs and action logic.
import cats.effect.IO
import services.merchant.objects.{MerchantApplication, MerchantProfile, PersistedMerchantState, Store}
import services.merchant.tables.merchantapplications.*
import services.merchant.tables.merchantprofiles.*
import services.merchant.tables.stores.*

import java.sql.{Connection, Timestamp}

def initializeMerchantTables(connection: Connection): IO[Unit] =
  List(
    initializeStoreTable(connection),
    initializeMerchantProfileTable(connection),
    initializeMerchantApplicationTable(connection),
  ).foldLeft(IO.unit)(_ *> _)

def loadPersistedMerchantState(connection: Connection): IO[PersistedMerchantState] =
  for
    stores <- loadPersistedStores(connection)
    merchantProfiles <- loadPersistedMerchantProfiles(connection)
    merchantApplications <- loadPersistedMerchantApplications(connection)
  yield PersistedMerchantState(
    stores = stores,
    merchantProfiles = merchantProfiles,
    merchantApplications = merchantApplications,
  )

def replacePersistedMerchantState(
    connection: Connection,
    stores: List[Store],
    merchantProfiles: List[MerchantProfile],
    merchantApplications: List[MerchantApplication],
    updatedAt: Timestamp,
): Unit =
  replacePersistedStores(connection, stores, updatedAt)
  replacePersistedMerchantProfiles(connection, merchantProfiles, updatedAt)
  replacePersistedMerchantApplications(connection, merchantApplications, updatedAt)
