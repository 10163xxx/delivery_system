// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { IsoDateTime } from '@/objects/core/SharedObjects'

export type OrderSummaryLifecycle = {
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}
