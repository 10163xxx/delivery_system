import type { MerchantRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { useMerchantConsoleState } from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import type {
  AddressText,
  DisplayText,
  EntityCount,
  MenuItem,
  MenuItemId,
  OrderId,
  OrderSummary,
  RefundRequestId,
  Store,
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
type MerchantMenuFieldBindings = Pick<
  MerchantConsolePanelProps,
  | 'getMenuItemDraft'
  | 'getMenuItemFieldId'
  | 'getMerchantFieldClassName'
  | 'menuItemFormErrors'
  | 'setMenuItemDrafts'
  | 'setMenuItemFormErrors'
>

type MerchantMenuImageBindings = MerchantMenuFieldBindings &
  Pick<MerchantConsolePanelProps, 'isMenuItemImageUploading' | 'uploadStoreMenuImage'>

type MerchantMenuComposerFooterBindings = Pick<
  MerchantConsolePanelProps,
  'isMenuItemImageUploading' | 'setMenuComposerOpen' | 'submitStoreMenuItem'
>

type MerchantMenuSectionItemCardBindings = Pick<
  MerchantConsolePanelProps,
  | 'clearMenuItemStockLimit'
  | 'formatPrice'
  | 'getMenuItemCategoryDraft'
  | 'getMenuItemCategoryError'
  | 'getMenuItemPriceDraft'
  | 'getMenuItemPriceError'
  | 'getMenuItemStockDraft'
  | 'getMenuItemStockError'
  | 'getMerchantFieldClassName'
  | 'monthlySalesByMenuItem'
  | 'removeMenuItem'
  | 'runAction'
  | 'setMenuItemCategoryDrafts'
  | 'setMenuItemPriceDrafts'
  | 'setMenuItemStockDrafts'
  | 'submitMenuItemCategory'
  | 'submitMenuItemPrice'
  | 'submitMenuItemStock'
>

type MerchantMenuSectionItemCardActionBindings = Omit<
  MerchantMenuSectionItemCardBindings,
  'formatPrice' | 'monthlySalesByMenuItem'
>

export type MerchantMenuBasicFieldsProps = {
  storeId: StoreId
  props: MerchantMenuFieldBindings
}

export type MerchantMenuImageFieldsProps = {
  storeId: StoreId
  storeName: DisplayText
  props: MerchantMenuImageBindings
}

export type MerchantMenuComposerFooterProps = {
  storeId: StoreId
  props: MerchantMenuComposerFooterBindings
}

export type MerchantMenuSectionComposerProps = {
  store: Store
  props: MerchantConsolePanelProps
}

export type MerchantStorePanelProps = {
  state: NonNullable<MerchantConsolePanelProps['state']>
  store: Store
  storeOrders: OrderSummary[]
  props: MerchantConsolePanelProps
}

export type MerchantStoreSidebarProps = {
  store: Store
  props: MerchantConsolePanelProps
}

export type MerchantMenuSectionItemCardProps = {
  item: MenuItem
  store: Store
  props: MerchantMenuSectionItemCardBindings
}

export type MerchantMenuSectionItemCardInfoProps = {
  item: MenuItem
  monthlySales: EntityCount
}

export type MerchantMenuSectionItemCardActionProps = {
  item: MenuItem
  storeId: StoreId
  props: MerchantMenuSectionItemCardActionBindings
}
