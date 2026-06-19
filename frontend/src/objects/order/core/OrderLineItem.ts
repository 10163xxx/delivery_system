// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  CurrencyCents,
  DisplayText,
  MenuItemId,
  Quantity,
} from '@/objects/core/SharedObjects'
import type { OrderItemSelection } from '@/objects/order/core/OrderItemSelection'

export type OrderLineItem = {
  menuItemId: MenuItemId
  name: DisplayText
  quantity: Quantity
  unitPriceCents: CurrencyCents
  refundedQuantity: Quantity
  selections: OrderItemSelection[]
}
