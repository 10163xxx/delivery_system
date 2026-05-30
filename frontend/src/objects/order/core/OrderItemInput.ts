import type { MenuItemId, Quantity } from '@/objects/domain/DomainObjects'
import type { OrderItemSelection } from '@/objects/order/core/OrderItemSelection'

export type OrderItemInput = {
  menuItemId: MenuItemId
  quantity: Quantity
  selections: OrderItemSelection[]
}
