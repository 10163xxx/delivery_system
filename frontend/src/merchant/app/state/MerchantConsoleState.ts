import { useState } from 'react'
import type { Store } from '@/shared/object/core/SharedObjects'
import type {
  MerchantConsolePanelProps,
  MerchantConsoleStateArgs,
  MenuComposerOpenState,
  MerchantAppealDraftMap,
  OrderChatDraftMap,
  OrderRejectDraftMap,
  PartialRefundResolutionDraftMap,
  StoreOperationDraft,
  StoreOperationErrors,
} from '@/merchant/object/console/MerchantConsoleObjects'
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
  const [menuItemStockDrafts, setMenuItemStockDrafts] = useState<Record<string, string>>({})
  const [menuItemPriceDrafts, setMenuItemPriceDrafts] = useState<Record<string, string>>({})
  const [orderRejectDrafts, setOrderRejectDrafts] = useState<Record<string, string>>({})
  const [orderRejectErrors, setOrderRejectErrors] = useState<Record<string, string>>({})
  const [storeOperationDrafts, setStoreOperationDrafts] = useState<Record<string, StoreOperationDraft>>({})
  const [storeOperationErrors, setStoreOperationErrors] = useState<Record<string, StoreOperationErrors>>({})
  const selectors = createMerchantConsoleSelectors({
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
    setMenuItemStockDrafts,
    setMenuItemPriceDrafts,
    setOrderRejectDrafts,
    setOrderRejectErrors,
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
}
export type { MerchantConsolePanelProps }
