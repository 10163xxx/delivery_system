package services.merchant.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.objects.given
import services.merchant.objects.apiTypes.*
import system.app.objects.*

import cats.effect.IO
import services.merchant.objects.*
import services.order.objects.*
import system.objects.*
import system.app.*

private def addMenuItemToStore(store: Store, menuItem: MenuItem): Store =
    store.copy(operations = store.operations.copy(menu = store.menu :+ menuItem))

private def removeMenuItemFromStore(store: Store, menuItemId: MenuItemId): Store =
    store.copy(operations = store.operations.copy(menu = store.menu.filterNot(_.id == menuItemId)))

private def updateMenuItemInStore(
      store: Store,
      menuItemId: MenuItemId,
      update: MenuItem => MenuItem,
  ): Store =
    store.copy(
      operations = store.operations.copy(
        menu = store.menu.map(item => if item.id == menuItemId then update(item) else item)
      )
    )

private def buildMenuItem(request: AddMenuItemRequest): MenuItem =
    MenuItem(
      id = nextId(new DisplayText("dish")),
      name = request.name,
      category = request.category,
      description = request.description,
      priceCents = request.priceCents,
      imageUrl = request.imageUrl,
      remainingQuantity = request.remainingQuantity,
      selectionGroups = request.selectionGroups,
    )

private def validateStoreForMenuWrite(store: Store): Either[ErrorMessage, Unit] =
    Either.cond(store.status != StoreRevokedStatus, (), ValidationMessages.Merchant.RevokedStoreCannotAddMenuItem)

def addMenuItem(
      storeId: StoreId,
      request: AddMenuItemRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.Merchant.StoreNotFound)
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
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.Merchant.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.Merchant.MenuItemNotFound)
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
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.Merchant.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.Merchant.MenuItemNotFound)
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
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.Merchant.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.Merchant.MenuItemNotFound)
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

def updateMenuItemCategory(
      storeId: StoreId,
      menuItemId: MenuItemId,
      request: UpdateMenuItemCategoryRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          store <- current.stores.find(_.id == storeId).toRight(ValidationMessages.Merchant.StoreNotFound)
          _ <- store.menu.find(_.id == menuItemId).toRight(ValidationMessages.Merchant.MenuItemNotFound)
          sanitized <- validateMenuItemCategoryRequest(request)
        yield
          withDerivedData(
            replaceStore(
              current,
              store.id,
              updateMenuItemInStore(_, menuItemId, _.copy(category = Some(sanitized.category))),
            )
          )
      }
    }
