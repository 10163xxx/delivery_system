import type { MerchantRoleProps } from '@/shared/app/role-props'
import type { useMerchantConsoleState } from '@/merchant/app/state/MerchantConsoleState'
import type { MenuItem, OrderSummary, Store } from '@/shared/object/core/SharedObjects'

export type StoreOperationDraft = {
  openTime: string
  closeTime: string
  avgPrepMinutes: string
}

export type StoreOperationErrors = {
  openTime?: string
  closeTime?: string
  avgPrepMinutes?: string
}

export type MerchantConsoleStateArgs = Pick<
  MerchantRoleProps,
  'merchantStores' | 'selectedMerchantStoreId' | 'runAction'
>

export type MenuComposerOpenState = Record<string, boolean>
export type MerchantAppealDraftMap = Record<string, string>
export type PartialRefundResolutionDraftMap = Record<string, string>
export type OrderRejectDraftMap = Record<string, string>
export type OrderChatDraftMap = Record<string, string>

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
  | 'getMenuItemPriceDraft'
  | 'getMenuItemPriceError'
  | 'getMenuItemStockDraft'
  | 'getMenuItemStockError'
  | 'getMerchantFieldClassName'
  | 'monthlySalesByMenuItem'
  | 'removeStoreMenuItem'
  | 'runAction'
  | 'setMenuItemPriceDrafts'
  | 'setMenuItemStockDrafts'
  | 'submitMenuItemPrice'
  | 'submitMenuItemStock'
>

type MerchantMenuSectionItemCardActionBindings = Omit<
  MerchantMenuSectionItemCardBindings,
  'formatPrice' | 'monthlySalesByMenuItem'
>

export type MerchantMenuBasicFieldsProps = {
  storeId: string
  props: MerchantMenuFieldBindings
}

export type MerchantMenuImageFieldsProps = {
  storeId: string
  storeName: string
  props: MerchantMenuImageBindings
}

export type MerchantMenuComposerFooterProps = {
  storeId: string
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
  monthlySales: number
}

export type MerchantMenuSectionItemCardActionProps = {
  item: MenuItem
  storeId: string
  props: MerchantMenuSectionItemCardActionBindings
}
