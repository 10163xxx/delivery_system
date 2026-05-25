import type {
  CurrencyCents,
  DescriptionText,
  DisplayText,
  ImageUrl,
  Quantity,
} from '@/shared/object/domain/DomainObjects'
import type { MenuItemSelectionGroup } from '@/merchant/object/menu/MenuItemSelectionGroup'

export type AddMenuItemRequest = {
  name: DisplayText
  category?: DisplayText
  description: DescriptionText
  priceCents: CurrencyCents
  imageUrl?: ImageUrl
  remainingQuantity?: Quantity
  selectionGroups: MenuItemSelectionGroup[]
}
