import type {
  CurrencyCents,
  DescriptionText,
  DisplayText,
  ImageUrl,
  MenuItemId,
  Quantity,
} from '@/shared/object/domain/DomainObjects'

export type MenuItem = {
  id: MenuItemId
  name: DisplayText
  description: DescriptionText
  priceCents: CurrencyCents
  imageUrl?: ImageUrl
  remainingQuantity?: Quantity
}
