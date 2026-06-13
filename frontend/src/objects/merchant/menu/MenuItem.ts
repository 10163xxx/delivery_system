import type {
  CurrencyCents,
  DescriptionText,
  DisplayText,
  ImageUrl,
  MenuItemId,
  Quantity,
} from '@/objects/core/SharedObjects'
import type { MenuItemSelectionGroup } from '@/objects/merchant/menu/MenuItemSelectionGroup'

export type MenuItem = {
  id: MenuItemId
  name: DisplayText
  category?: DisplayText
  description: DescriptionText
  priceCents: CurrencyCents
  imageUrl?: ImageUrl
  remainingQuantity?: Quantity
  selectionGroups: MenuItemSelectionGroup[]
}
