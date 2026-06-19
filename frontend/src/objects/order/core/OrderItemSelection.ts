// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { DisplayText } from '@/objects/core/SharedObjects'

export type OrderItemSelection = {
  groupName: DisplayText
  selectedOptions: DisplayText[]
}
