import type { MenuItemId, Quantity, ReasonText } from '@/objects/core/SharedObjects'

export type SubmitPartialRefundRequest = {
  menuItemId: MenuItemId
  quantity: Quantity
  reason: ReasonText
}
