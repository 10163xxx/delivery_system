import type {
  CurrencyCents,
  DisplayText,
  MenuItemId,
  Quantity,
} from '@/objects/domain/DomainObjects'
import type { OrderItemSelection } from '@/objects/order/core/OrderItemSelection'

export type OrderLineItem = {
  menuItemId: MenuItemId
  name: DisplayText
  quantity: Quantity
  unitPriceCents: CurrencyCents
  refundedQuantity: Quantity
  selections: OrderItemSelection[]
}
