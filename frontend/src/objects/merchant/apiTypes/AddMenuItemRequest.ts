// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type {
  CurrencyCents,
  DescriptionText,
  DisplayText,
  ImageUrl,
  Quantity,
} from '@/objects/core/SharedObjects'
import type { MenuItemSelectionGroup } from '@/objects/merchant/menu/MenuItemSelectionGroup'

export type AddMenuItemRequest = {
  name: DisplayText
  category?: DisplayText
  description: DescriptionText
  priceCents: CurrencyCents
  imageUrl?: ImageUrl
  remainingQuantity?: Quantity
  selectionGroups: MenuItemSelectionGroup[]
}
