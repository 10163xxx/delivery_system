import type {
  MenuItem,
  OrderId,
  Store,
} from '@/objects/core/SharedObjects'
import {
  CURRENCY_CENTS_SCALE,
  CURRENCY_DECIMAL_PLACES,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import type {
  MenuItemCategoryDraftMap,
  MenuItemPriceDraftMap,
  MenuItemStockDraftMap,
  OrderRejectDraftMap,
  StoreOperationDraftMap,
} from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'
import { buildStoreOperationDraft } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleStoreOperations'
import { toDisplayText } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleValueHelpers'

export function createMerchantConsoleSelectors({
  menuItemCategoryDrafts,
  menuItemPriceDrafts,
  menuItemStockDrafts,
  orderRejectDrafts,
  orderRejectErrors,
  storeOperationDrafts,
}: {
  menuItemCategoryDrafts: MenuItemCategoryDraftMap
  menuItemPriceDrafts: MenuItemPriceDraftMap
  menuItemStockDrafts: MenuItemStockDraftMap
  orderRejectDrafts: OrderRejectDraftMap
  orderRejectErrors: OrderRejectDraftMap
  storeOperationDrafts: StoreOperationDraftMap
}) {
  function getMenuItemStockDraft(item: MenuItem) {
    return menuItemStockDrafts[item.id] ?? toDisplayText(item.remainingQuantity == null ? '' : String(item.remainingQuantity))
  }

  function getMenuItemCategoryDraft(item: MenuItem) {
    return menuItemCategoryDrafts[item.id] ?? toDisplayText(item.category ?? '')
  }

  function getMenuItemPriceDraft(item: MenuItem) {
    return menuItemPriceDrafts[item.id] ?? toDisplayText((item.priceCents / CURRENCY_CENTS_SCALE).toFixed(CURRENCY_DECIMAL_PLACES))
  }

  function getOrderRejectDraft(orderId: OrderId) {
    return orderRejectDrafts[orderId] ?? toDisplayText('')
  }

  function getOrderRejectError(orderId: OrderId) {
    return orderRejectErrors[orderId] ?? toDisplayText('')
  }

  function getStoreOperationDraft(store: Store) {
    return storeOperationDrafts[store.id] ?? buildStoreOperationDraft(store)
  }

  return {
    getMenuItemCategoryDraft,
    getMenuItemPriceDraft,
    getMenuItemStockDraft,
    getOrderRejectDraft,
    getOrderRejectError,
    getStoreOperationDraft,
  }
}
