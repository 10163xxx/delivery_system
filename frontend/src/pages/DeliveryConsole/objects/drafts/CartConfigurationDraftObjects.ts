import type {
  DisplayText,
  MenuItemId,
  Quantity,
} from '@/objects/core/SharedObjects'
import type { OrderItemSelection } from '@/objects/core/SharedObjects'

export type SelectedMenuItemConfiguration = {
  selections: OrderItemSelection[]
  summaryText: DisplayText
}

export type MenuItemConfigurationModalState = {
  itemId: MenuItemId
  quantityAfterConfirm: Quantity
  draftSelections: Record<DisplayText, DisplayText[]>
  errorText: DisplayText | null
}
