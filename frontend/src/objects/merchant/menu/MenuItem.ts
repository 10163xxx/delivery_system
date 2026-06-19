// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
