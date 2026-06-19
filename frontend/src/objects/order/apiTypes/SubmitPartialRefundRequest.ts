// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { MenuItemId, Quantity, ReasonText } from '@/objects/core/SharedObjects'

export type SubmitPartialRefundRequest = {
  menuItemId: MenuItemId
  quantity: Quantity
  reason: ReasonText
}
