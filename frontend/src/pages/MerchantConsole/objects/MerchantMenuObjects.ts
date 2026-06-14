import type {
  DisplayText,
  EntityCount,
  MenuItem,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import type { MerchantConsolePanelProps } from '@/pages/MerchantConsole/objects/MerchantConsoleStateObjects'

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
