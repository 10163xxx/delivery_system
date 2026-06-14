import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export function optionalDomainText<T extends string>(value: string): T | undefined {
  return value ? asDomainText<T>(value) : undefined
}
