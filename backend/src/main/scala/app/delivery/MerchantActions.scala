package app.delivery

import cats.effect.IO
import domain.merchant.*
import domain.order.*
import domain.shared.*

def submitMerchantApplication(
      request: MerchantRegistrationRequest
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        validateMerchantRegistration(request).map { sanitized =>
          val timestamp = now()
          val application = MerchantApplication(
            id = nextId("app"),
            merchantName = sanitized.merchantName,
            storeName = sanitized.storeName,
            category = sanitized.category,
            businessHours = sanitized.businessHours,
            avgPrepMinutes = sanitized.avgPrepMinutes,
            imageUrl = sanitized.imageUrl,
            note = sanitized.note,
            status = MerchantApplicationStatus.Pending,
            reviewNote = None,
            submittedAt = timestamp,
            reviewedAt = None,
          )
          withDerivedData(
            current.copy(merchantApplications = application :: current.merchantApplications)
          )
        }
      }
    }

def approveMerchantApplication(
      applicationId: String,
      request: ReviewMerchantApplicationRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          application <- current.merchantApplications.find(_.id == applicationId).toRight(ValidationMessages.MerchantApplicationNotFound)
          _ <- Either.cond(application.status == MerchantApplicationStatus.Pending, (), ValidationMessages.OnlyPendingApplicationCanApprove)
          reviewNote <- sanitizeRequiredText(request.reviewNote, DeliveryValidationDefaults.ReviewApplicationNoteMaxLength, ValidationMessages.ReviewNoteRequired)
        yield
          val timestamp = now()
          val reviewedApplication = application.copy(
            status = MerchantApplicationStatus.Approved,
            reviewNote = Some(reviewNote),
            reviewedAt = Some(timestamp),
          )
          withDerivedData(
            current.copy(
              stores = createApprovedStore(application) :: current.stores,
              merchantApplications = replaceApplication(current.merchantApplications, reviewedApplication),
            )
          )
      }
    }

def rejectMerchantApplication(
      applicationId: String,
      request: ReviewMerchantApplicationRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          application <- current.merchantApplications.find(_.id == applicationId).toRight(ValidationMessages.MerchantApplicationNotFound)
          _ <- Either.cond(application.status == MerchantApplicationStatus.Pending, (), ValidationMessages.OnlyPendingApplicationCanReject)
          reviewNote <- sanitizeRequiredText(request.reviewNote, DeliveryValidationDefaults.ReviewApplicationNoteMaxLength, ValidationMessages.ReviewNoteRequired)
        yield
          val timestamp = now()
          val reviewedApplication = application.copy(
            status = MerchantApplicationStatus.Rejected,
            reviewNote = Some(reviewNote),
            reviewedAt = Some(timestamp),
          )
          withDerivedData(
            current.copy(
              merchantApplications = replaceApplication(current.merchantApplications, reviewedApplication)
            )
          )
      }
    }

def addMenuItem(
      storeId: String,
      request: AddMenuItemRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          _ <- Either.cond(store.status != "Revoked", (), ValidationMessages.RevokedStoreCannotAddMenuItem)
          sanitized <- validateMenuItemRequest(request)
          nextMenuItem = MenuItem(
            id = nextId("dish"),
            name = sanitized.name,
            description = sanitized.description,
            priceCents = sanitized.priceCents,
            imageUrl = sanitized.imageUrl,
            remainingQuantity = sanitized.remainingQuantity,
          )
        yield
          withDerivedData(
            current.copy(
              stores = current.stores.map(entry =>
                if entry.id == store.id then entry.copy(menu = entry.menu :+ nextMenuItem) else entry
              )
            )
          )
      }
    }

def removeMenuItem(
      storeId: String,
      menuItemId: String,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.MenuItemNotFound)
        yield
          withDerivedData(
            current.copy(
              stores = current.stores.map(entry =>
                if entry.id == store.id then entry.copy(menu = entry.menu.filterNot(_.id == menuItemId))
                else entry
              )
            )
          )
      }
    }

def updateMenuItemStock(
      storeId: String,
      menuItemId: String,
      request: UpdateMenuItemStockRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.MenuItemNotFound)
          sanitized <- validateMenuItemStockRequest(request)
        yield
          withDerivedData(
            current.copy(
              stores = current.stores.map(entry =>
                if entry.id == store.id then
                  entry.copy(
                    menu = entry.menu.map(menuItem =>
                      if menuItem.id == menuItemId then menuItem.copy(remainingQuantity = sanitized.remainingQuantity)
                      else menuItem
                    )
                  )
                else entry
              )
            )
          )
      }
    }

def updateStoreOperationalInfo(
      storeId: String,
      request: UpdateStoreOperationalRequest,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          businessHours <- validateBusinessHours(request.businessHours)
          _ <- Either.cond(
            request.avgPrepMinutes >= DeliveryValidationDefaults.PrepMinutesMin &&
              request.avgPrepMinutes <= DeliveryValidationDefaults.PrepMinutesMax,
            (),
            ValidationMessages.PrepMinutesInvalid,
          )
        yield
          withDerivedData(
            current.copy(
              stores = current.stores.map(entry =>
                if entry.id == store.id then
                  entry.copy(
                    businessHours = businessHours,
                    avgPrepMinutes = request.avgPrepMinutes,
                  )
                else entry
              )
            )
          )
      }
    }
