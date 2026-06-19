// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { CurrencyCents, DisplayText } from '@/objects/core/SharedObjects'

export type MenuItemSelectionOption = {
  name: DisplayText
  additionalPriceCents: CurrencyCents
}
