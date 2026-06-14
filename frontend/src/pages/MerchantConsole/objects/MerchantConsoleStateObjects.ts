import type { MerchantRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { useMerchantConsoleState } from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import type {
  AddressText,
  DisplayText,
  MenuItemId,
  OrderId,
  RefundRequestId,
  StoreId,
  TimeOfDay,
} from '@/objects/core/SharedObjects'

export type StoreOperationDraft = {
  storeAddress: AddressText
  openTime: TimeOfDay
  closeTime: TimeOfDay
  avgPrepMinutes: DisplayText
}

export type StoreOperationErrors = {
  storeAddress?: DisplayText
  openTime?: DisplayText
  closeTime?: DisplayText
  avgPrepMinutes?: DisplayText
}

export type MerchantConsoleStateArgs = Pick<
  MerchantRoleProps,
  'merchantStores' | 'selectedMerchantStoreId' | 'runAction'
>

export type MenuComposerOpenState = Record<StoreId, boolean>
export type MerchantAppealDraftMap = Record<OrderId, DisplayText>
export type PartialRefundResolutionDraftMap = Record<RefundRequestId, DisplayText>
export type OrderRejectDraftMap = Record<OrderId, DisplayText>
export type OrderChatDraftMap = Record<OrderId, DisplayText>
export type StoreReviewReplyDraftMap = Record<OrderId, DisplayText>
export type MenuItemCategoryDraftMap = Record<MenuItemId, DisplayText>
export type MenuItemStockDraftMap = Record<MenuItemId, DisplayText>
export type MenuItemPriceDraftMap = Record<MenuItemId, DisplayText>
export type StoreOperationDraftMap = Record<StoreId, StoreOperationDraft>
export type StoreOperationErrorMap = Record<StoreId, StoreOperationErrors>

export type MerchantConsoleState = ReturnType<typeof useMerchantConsoleState>
export type MerchantConsolePanelProps = MerchantRoleProps & MerchantConsoleState
