import type { DisplayText, EntityCount } from '@/objects/core/SharedObjects'
import type { MenuItemSelectionOption } from '@/objects/merchant/menu/MenuItemSelectionOption'

export type MenuItemSelectionGroup = {
  name: DisplayText
  minSelections: EntityCount
  maxSelections: EntityCount
  options: MenuItemSelectionOption[]
}
