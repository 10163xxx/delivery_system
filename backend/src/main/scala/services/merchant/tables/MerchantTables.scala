package services.merchant.tables

import cats.effect.IO
import domain.merchant.{MerchantApplication, MerchantProfile, PersistedMerchantState, Store}

import java.sql.{Connection, Timestamp}

def initializeMerchantTables(connection: Connection): IO[Unit] =
  List(
    initializeDeliveryStoresTable(connection),
    initializeDeliveryMerchantProfilesTable(connection),
    initializeDeliveryMerchantApplicationsTable(connection),
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
