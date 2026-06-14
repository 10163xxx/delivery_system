import type {
  DisplayText,
  EntityCount,
  MenuItem,
  StoreId,
} from '@/objects/core/SharedObjects'

export const MENU_ITEM_FORM_FIELD = {
  name: 'name',
  category: 'category',
  description: 'description',
  priceYuan: 'priceYuan',
  remainingQuantity: 'remainingQuantity',
  imageUrl: 'imageUrl',
  selectionGroupsText: 'selectionGroupsText',
} as const

export type MenuItemFormField =
  (typeof MENU_ITEM_FORM_FIELD)[keyof typeof MENU_ITEM_FORM_FIELD]

export type MerchantCategorySectionId = DisplayText

export type MerchantMenuSectionItemCardInfoProps = {
  item: MenuItem
  monthlySales: EntityCount
}

export type MerchantStoreMenuFieldProps = {
  storeId: StoreId
}

export type MerchantStoreMenuImageProps = MerchantStoreMenuFieldProps & {
  storeName: DisplayText
}
