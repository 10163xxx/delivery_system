import type {
  CurrencyCents,
  DescriptionText,
  DisplayText,
  ImageUrl,
  Quantity,
} from '@/objects/domain/DomainObjects'
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
