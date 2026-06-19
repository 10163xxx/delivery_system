// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { AvailabilityLabel } from '@/objects/rider/AvailabilityLabel'

export const RIDER_AVAILABILITY = {
  available: 'Available' as AvailabilityLabel,
  onDelivery: 'OnDelivery' as AvailabilityLabel,
  unavailable: 'Unavailable' as AvailabilityLabel,
  suspended: 'Suspended' as AvailabilityLabel,
} as const
