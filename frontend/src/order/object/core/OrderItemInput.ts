import type { MenuItemId, Quantity } from '@/shared/object/domain/DomainObjects'

export type OrderItemInput = {
  menuItemId: MenuItemId
  quantity: Quantity
}
