import type { DisplayText } from '@/shared/object/domain/DomainObjects'

export type MenuItemSelectionGroup = {
  name: DisplayText
  minSelections: number
  maxSelections: number
  options: DisplayText[]
}
