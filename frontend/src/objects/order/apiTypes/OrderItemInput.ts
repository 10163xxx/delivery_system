// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { MenuItemId, Quantity } from '@/objects/core/SharedObjects'
import type { OrderItemSelection } from '@/objects/order/core/OrderItemSelection'

export type OrderItemInput = {
  menuItemId: MenuItemId
  quantity: Quantity
  selections: OrderItemSelection[]
}
