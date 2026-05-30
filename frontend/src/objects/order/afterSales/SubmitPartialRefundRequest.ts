import type { MenuItemId, Quantity, ReasonText } from '@/objects/domain/DomainObjects'

export type SubmitPartialRefundRequest = {
  menuItemId: MenuItemId
  quantity: Quantity
  reason: ReasonText
}
