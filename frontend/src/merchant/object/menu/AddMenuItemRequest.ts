import type {
  CurrencyCents,
  DescriptionText,
  DisplayText,
  ImageUrl,
  Quantity,
} from '@/shared/object/domain/DomainObjects'

export type AddMenuItemRequest = {
  name: DisplayText
  description: DescriptionText
  priceCents: CurrencyCents
  imageUrl?: ImageUrl
  remainingQuantity?: Quantity
}
