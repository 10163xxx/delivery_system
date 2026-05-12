import type { MenuItemId, Quantity, ReasonText } from '@/shared/object/domain/DomainObjects'

export type SubmitPartialRefundRequest = {
  menuItemId: MenuItemId
  quantity: Quantity
  reason: ReasonText
}
