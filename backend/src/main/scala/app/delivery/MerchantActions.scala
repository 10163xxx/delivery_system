package app.delivery

import domain.shared.given

import cats.effect.IO
import domain.merchant.*
import domain.order.*
import domain.shared.*

private def findMerchantApplication(
      current: DeliveryAppState,
      applicationId: MerchantApplicationId,
  ): Either[ErrorMessage, MerchantApplication] =
    current.merchantApplications.find(_.id == applicationId).toRight(ValidationMessages.MerchantApplicationNotFound)

private def requirePendingApplication(
      application: MerchantApplication,
      pendingError: ErrorMessage,
  ): Either[ErrorMessage, Unit] =
    Either.cond(application.status == MerchantApplicationStatus.Pending, (), pendingError)

private def sanitizeReviewNote(request: ReviewMerchantApplicationRequest): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      request.reviewNote,
      DeliveryValidationDefaults.ReviewApplicationNoteMaxLength,
      ValidationMessages.ReviewNoteRequired,
    )

private def buildMerchantApplication(
      request: MerchantRegistrationRequest,
      timestamp: IsoDateTime,
  ): MerchantApplication =
    MerchantApplication(
      id = nextId(new DisplayText("app")),
      merchantName = request.merchantName,
      storeName = request.storeName,
      category = request.category,
      businessHours = request.businessHours,
      avgPrepMinutes = request.avgPrepMinutes,
      imageUrl = request.imageUrl,
      note = request.note,
      status = MerchantApplicationStatus.Pending,
      reviewNote = None,
      submittedAt = timestamp,
      reviewedAt = None,
    )

private def reviewMerchantApplication(
      application: MerchantApplication,
      status: MerchantApplicationStatus,
      reviewNote: ResolutionText,
      timestamp: IsoDateTime,
  ): MerchantApplication =
    application.copy(
      status = status,
      reviewNote = Some(reviewNote),
      reviewedAt = Some(timestamp),
    )

private def replaceStore(
      current: DeliveryAppState,
      storeId: StoreId,
      update: Store => Store,
  ): DeliveryAppState =
    current.copy(
      stores = current.stores.map(store => if store.id == storeId then update(store) else store)
    )

private def addMenuItemToStore(store: Store, menuItem: MenuItem): Store =
    store.copy(menu = store.menu :+ menuItem)

private def removeMenuItemFromStore(store: Store, menuItemId: MenuItemId): Store =
    store.copy(menu = store.menu.filterNot(_.id == menuItemId))

private def updateMenuItemInStore(
      store: Store,
      menuItemId: MenuItemId,
      update: MenuItem => MenuItem,
  ): Store =
    store.copy(
      menu = store.menu.map(item => if item.id == menuItemId then update(item) else item)
    )

private def buildMenuItem(request: AddMenuItemRequest): MenuItem =
    MenuItem(
      id = nextId(new DisplayText("dish")),
      name = request.name,
      description = request.description,
      priceCents = request.priceCents,
      imageUrl = request.imageUrl,
      remainingQuantity = request.remainingQuantity,
    )

private def validateStoreForMenuWrite(store: Store): Either[ErrorMessage, Unit] =
    Either.cond(store.status != StoreRevokedStatus, (), ValidationMessages.RevokedStoreCannotAddMenuItem)

private def validatePrepMinutes(value: Minutes): Either[ErrorMessage, Minutes] =
    Either.cond(
      value >= DeliveryValidationDefaults.PrepMinutesMin &&
        value <= DeliveryValidationDefaults.PrepMinutesMax,
      value,
      ValidationMessages.PrepMinutesInvalid,
    )

def submitMerchantApplication(
      request: MerchantRegistrationRequest
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        validateMerchantRegistration(request).map { sanitized =>
          val timestamp = now()
          val application = buildMerchantApplication(sanitized, timestamp)
          withDerivedData(
            current.copy(merchantApplications = application :: current.merchantApplications)
          )
        }
      }
    }

def approveMerchantApplication(
      applicationId: MerchantApplicationId,
      request: ReviewMerchantApplicationRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          application <- findMerchantApplication(current, applicationId)
          _ <- requirePendingApplication(application, ValidationMessages.OnlyPendingApplicationCanApprove)
          reviewNote <- sanitizeReviewNote(request)
        yield
          val timestamp = now()
          val reviewedApplication =
            reviewMerchantApplication(application, MerchantApplicationStatus.Approved, reviewNote, timestamp)
          withDerivedData(
            current.copy(
              stores = createApprovedStore(application) :: current.stores,
              merchantApplications = replaceApplication(current.merchantApplications, reviewedApplication),
            )
          )
      }
    }

def rejectMerchantApplication(
      applicationId: MerchantApplicationId,
      request: ReviewMerchantApplicationRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          application <- findMerchantApplication(current, applicationId)
          _ <- requirePendingApplication(application, ValidationMessages.OnlyPendingApplicationCanReject)
          reviewNote <- sanitizeReviewNote(request)
        yield
          val timestamp = now()
          val reviewedApplication =
            reviewMerchantApplication(application, MerchantApplicationStatus.Rejected, reviewNote, timestamp)
          withDerivedData(
            current.copy(
              merchantApplications = replaceApplication(current.merchantApplications, reviewedApplication)
            )
          )
      }
    }

def addMenuItem(
      storeId: StoreId,
      request: AddMenuItemRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          _ <- validateStoreForMenuWrite(store)
          sanitized <- validateMenuItemRequest(request)
          nextMenuItem = buildMenuItem(sanitized)
        yield
          withDerivedData(
            replaceStore(current, store.id, addMenuItemToStore(_, nextMenuItem))
          )
      }
    }

def removeMenuItem(
      storeId: StoreId,
      menuItemId: MenuItemId,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.MenuItemNotFound)
        yield
          withDerivedData(
            replaceStore(current, store.id, removeMenuItemFromStore(_, menuItemId))
          )
      }
    }

def updateMenuItemStock(
      storeId: StoreId,
      menuItemId: MenuItemId,
      request: UpdateMenuItemStockRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.MenuItemNotFound)
          sanitized <- validateMenuItemStockRequest(request)
        yield
          withDerivedData(
            replaceStore(
              current,
              store.id,
              updateMenuItemInStore(_, menuItemId, _.copy(remainingQuantity = sanitized.remainingQuantity)),
            )
          )
      }
    }

def updateMenuItemPrice(
      storeId: StoreId,
      menuItemId: MenuItemId,
      request: UpdateMenuItemPriceRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.MenuItemNotFound)
          sanitized <- validateMenuItemPriceRequest(request)
        yield
          withDerivedData(
            replaceStore(
              current,
              store.id,
              updateMenuItemInStore(_, menuItemId, _.copy(priceCents = sanitized.priceCents)),
            )
          )
      }
    }

def updateStoreOperationalInfo(
      storeId: StoreId,
      request: UpdateStoreOperationalRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.StoreNotFound)
          businessHours <- validateBusinessHours(request.businessHours)
          avgPrepMinutes <- validatePrepMinutes(request.avgPrepMinutes)
        yield
          withDerivedData(
            replaceStore(
              current,
              store.id,
              _.copy(businessHours = businessHours, avgPrepMinutes = avgPrepMinutes),
            )
          )
      }
    }
