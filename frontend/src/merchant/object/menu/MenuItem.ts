import type {
  CurrencyCents,
  DescriptionText,
  DisplayText,
  ImageUrl,
  MenuItemId,
  Quantity,
} from '@/shared/object/domain/DomainObjects'
import type { MenuItemSelectionGroup } from '@/merchant/object/menu/MenuItemSelectionGroup'

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
