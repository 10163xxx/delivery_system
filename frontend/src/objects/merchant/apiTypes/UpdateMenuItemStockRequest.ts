// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { Quantity } from '@/objects/core/SharedObjects'

export type UpdateMenuItemStockRequest = {
  remainingQuantity?: Quantity
}
