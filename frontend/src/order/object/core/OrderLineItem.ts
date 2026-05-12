import type {
  CurrencyCents,
  DisplayText,
  MenuItemId,
  Quantity,
} from '@/shared/object/domain/DomainObjects'

export type OrderLineItem = {
  menuItemId: MenuItemId
  name: DisplayText
  quantity: Quantity
  unitPriceCents: CurrencyCents
  refundedQuantity: Quantity
}
