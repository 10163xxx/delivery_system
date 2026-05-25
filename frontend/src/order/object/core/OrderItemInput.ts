import type { MenuItemId, Quantity } from '@/shared/object/domain/DomainObjects'
import type { OrderItemSelection } from '@/order/object/core/OrderItemSelection'

export type OrderItemInput = {
  menuItemId: MenuItemId
  quantity: Quantity
  selections: OrderItemSelection[]
}
