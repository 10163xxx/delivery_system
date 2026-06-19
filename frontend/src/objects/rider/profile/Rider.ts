// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { RiderIdentity } from '@/objects/rider/profile/RiderIdentity'
import type { RiderPayout } from '@/objects/rider/profile/RiderPayout'
import type { RiderPerformance } from '@/objects/rider/profile/RiderPerformance'

export type { RiderIdentity } from '@/objects/rider/profile/RiderIdentity'
export type { RiderPayout } from '@/objects/rider/profile/RiderPayout'
export type { RiderPerformance } from '@/objects/rider/profile/RiderPerformance'

export type Rider = RiderIdentity & {
  identity: RiderIdentity
  performance: RiderPerformance
  payout: RiderPayout
} & RiderPerformance & RiderPayout
