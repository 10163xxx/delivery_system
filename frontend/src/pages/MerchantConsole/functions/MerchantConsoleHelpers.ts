import type { Dispatch, SetStateAction } from 'react'
import type {
  DisplayText,
  MenuItem,
  OrderId,
  Store,
} from '@/objects/core/SharedObjects'
import type {
  MenuItemCategoryDraftMap,
  MenuItemPriceDraftMap,
  MenuItemStockDraftMap,
  MerchantConsoleStateArgs,
  OrderRejectDraftMap,
  StoreOperationDraft,
  StoreOperationErrorMap,
} from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'
export { createMerchantConsoleSelectors } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleSelectors'
export { createMerchantConsoleValidators } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleValidators'
export {
  buildStoreOperationDraft,
  validateStoreOperationDraft,
} from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleStoreOperations'
import { createMenuItemUpdateActions } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantMenuItemActions'
import { createOrderRejectActions } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantOrderRejectActions'
import { createStoreOperationActions } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleStoreOperations'

export function createMerchantConsoleActions({
  getMenuItemCategoryDraft,
  getMenuItemCategoryError,
  getMenuItemPriceDraft,
  getMenuItemPriceError,
  getMenuItemStockDraft,
  getMenuItemStockError,
  getOrderRejectDraft,
  getStoreOperationDraft,
  runAction,
  setMenuItemCategoryDrafts,
  setMenuItemPriceDrafts,
  setMenuItemStockDrafts,
  setOrderRejectDrafts,
  setOrderRejectErrors,
  setStoreOperationErrors,
}: Pick<MerchantConsoleStateArgs, 'runAction'> & {
  getMenuItemCategoryDraft: (item: MenuItem) => DisplayText
  getMenuItemCategoryError: (value: DisplayText) => string | null
  getMenuItemPriceDraft: (item: MenuItem) => DisplayText
  getMenuItemPriceError: (value: DisplayText) => string | null
  getMenuItemStockDraft: (item: MenuItem) => DisplayText
  getMenuItemStockError: (value: DisplayText) => string | null
  getOrderRejectDraft: (orderId: OrderId) => DisplayText
  getStoreOperationDraft: (store: Store) => StoreOperationDraft
  setMenuItemCategoryDrafts: Dispatch<SetStateAction<MenuItemCategoryDraftMap>>
  setMenuItemPriceDrafts: Dispatch<SetStateAction<MenuItemPriceDraftMap>>
  setMenuItemStockDrafts: Dispatch<SetStateAction<MenuItemStockDraftMap>>
  setOrderRejectDrafts: Dispatch<SetStateAction<OrderRejectDraftMap>>
  setOrderRejectErrors: Dispatch<SetStateAction<OrderRejectDraftMap>>
  setStoreOperationErrors: Dispatch<SetStateAction<StoreOperationErrorMap>>
}) {
  return {
    ...createMenuItemUpdateActions({
      getMenuItemCategoryDraft,
      getMenuItemCategoryError,
      getMenuItemPriceDraft,
      getMenuItemPriceError,
      getMenuItemStockDraft,
      getMenuItemStockError,
      runAction,
      setMenuItemCategoryDrafts,
      setMenuItemPriceDrafts,
      setMenuItemStockDrafts,
    }),
    ...createOrderRejectActions({
      getOrderRejectDraft,
      runAction,
      setOrderRejectDrafts,
      setOrderRejectErrors,
    }),
    ...createStoreOperationActions({
      getStoreOperationDraft,
      runAction,
      setStoreOperationErrors,
    }),
  }
}
