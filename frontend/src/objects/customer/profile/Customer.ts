import type { CustomerIdentity } from '@/objects/customer/profile/CustomerIdentity'
import type { CustomerMetrics } from '@/objects/customer/profile/CustomerMetrics'

export type { CustomerIdentity } from '@/objects/customer/profile/CustomerIdentity'
export type { CustomerLocation } from '@/objects/customer/profile/CustomerLocation'
export type { CustomerMetrics } from '@/objects/customer/profile/CustomerMetrics'

export type Customer = CustomerIdentity & {
  metrics: CustomerMetrics
} & CustomerMetrics
