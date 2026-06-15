import type { DisplayText } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export function toDisplayText(value: string) {
  return asDomainText<DisplayText>(value)
}
