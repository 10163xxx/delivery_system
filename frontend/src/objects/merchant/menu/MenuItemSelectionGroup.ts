// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { DisplayText, EntityCount } from '@/objects/core/SharedObjects'
import type { MenuItemSelectionOption } from '@/objects/merchant/menu/MenuItemSelectionOption'

export type MenuItemSelectionGroup = {
  name: DisplayText
  minSelections: EntityCount
  maxSelections: EntityCount
  options: MenuItemSelectionOption[]
}
