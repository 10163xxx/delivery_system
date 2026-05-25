import type {
  CurrencyCents,
  DisplayText,
  MenuItemId,
  Quantity,
} from '@/shared/object/domain/DomainObjects'
import type { OrderItemSelection } from '@/order/object/core/OrderItemSelection'

export type OrderLineItem = {
  menuItemId: MenuItemId
  name: DisplayText
  quantity: Quantity
  unitPriceCents: CurrencyCents
  refundedQuantity: Quantity
  selections: OrderItemSelection[]
}
