import { useState } from 'react'
import type { Store } from '@/shared/object/core/SharedObjects'
import type {
  MerchantConsolePanelProps,
  MerchantConsoleStateArgs,
  MenuItemCategoryDraftMap,
  MenuItemPriceDraftMap,
  MenuItemStockDraftMap,
  MenuComposerOpenState,
  MerchantAppealDraftMap,
  OrderChatDraftMap,
  OrderRejectDraftMap,
  PartialRefundResolutionDraftMap,
  StoreReviewReplyDraftMap,
  StoreOperationDraftMap,
  StoreOperationErrorMap,
} from '@/pages/merchant/object/MerchantConsoleObjects'
import {
  createMerchantConsoleActions,
  createMerchantConsoleSelectors,
  createMerchantConsoleValidators,
} from '@/merchant/app/state/MerchantConsoleHelpers'

export function useMerchantConsoleState({
  merchantStores,
  selectedMerchantStoreId,
  runAction,
}: MerchantConsoleStateArgs) {
  const activeMerchantStore = merchantStores.find((store: Store) => store.id === selectedMerchantStoreId)
  const storesToRender = activeMerchantStore ? [activeMerchantStore] : merchantStores
  const [menuItemCategoryDrafts, setMenuItemCategoryDrafts] = useState<MenuItemCategoryDraftMap>({})
  const [menuItemStockDrafts, setMenuItemStockDrafts] = useState<MenuItemStockDraftMap>({})
  const [menuItemPriceDrafts, setMenuItemPriceDrafts] = useState<MenuItemPriceDraftMap>({})
  const [orderRejectDrafts, setOrderRejectDrafts] = useState<OrderRejectDraftMap>({})
  const [orderRejectErrors, setOrderRejectErrors] = useState<OrderRejectDraftMap>({})
  const [storeReviewReplyDrafts, setStoreReviewReplyDrafts] = useState<StoreReviewReplyDraftMap>({})
  const [storeOperationDrafts, setStoreOperationDrafts] = useState<StoreOperationDraftMap>({})
  const [storeOperationErrors, setStoreOperationErrors] = useState<StoreOperationErrorMap>({})
  const selectors = createMerchantConsoleSelectors({
    menuItemCategoryDrafts,
    menuItemPriceDrafts,
    menuItemStockDrafts,
    orderRejectDrafts,
    orderRejectErrors,
    storeOperationDrafts,
  })
  const validators = createMerchantConsoleValidators()
  const actions = createMerchantConsoleActions({
    ...selectors,
    ...validators,
    runAction,
    setMenuItemCategoryDrafts,
    setMenuItemPriceDrafts,
    setMenuItemStockDrafts,
    setOrderRejectDrafts,
    setOrderRejectErrors,
    setStoreOperationErrors,
  })

  return {
    activeMerchantStore,
    storesToRender,
    ...selectors,
    ...validators,
    ...actions,
    setMenuItemCategoryDrafts,
    setMenuItemStockDrafts,
    setMenuItemPriceDrafts,
    setOrderRejectDrafts,
    setOrderRejectErrors,
    storeReviewReplyDrafts,
    setStoreReviewReplyDrafts,
    setStoreOperationDrafts,
    setStoreOperationErrors,
    storeOperationErrors,
  }
}

export type MerchantConsoleState = ReturnType<typeof useMerchantConsoleState>
export type {
  MenuComposerOpenState,
  MerchantAppealDraftMap,
  OrderChatDraftMap,
  OrderRejectDraftMap,
  PartialRefundResolutionDraftMap,
  StoreReviewReplyDraftMap,
}
export type { MerchantConsolePanelProps }
