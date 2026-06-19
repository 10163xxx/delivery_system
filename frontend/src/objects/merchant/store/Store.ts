// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { StoreIdentity } from '@/objects/merchant/store/StoreIdentity'
import type { StoreMetrics } from '@/objects/merchant/store/StoreMetrics'
import type { StoreOperations } from '@/objects/merchant/store/StoreOperations'

export type { StoreIdentity } from '@/objects/merchant/store/StoreIdentity'
export type { StoreLocation } from '@/objects/merchant/store/StoreLocation'
export type { StoreMetrics } from '@/objects/merchant/store/StoreMetrics'
export type { StoreOperations } from '@/objects/merchant/store/StoreOperations'

export type Store = StoreIdentity & {
  operations: StoreOperations
  metrics: StoreMetrics
} & StoreOperations & StoreMetrics
