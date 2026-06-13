import type { AvailabilityLabel } from '@/objects/domain/AvailabilityLabel'

export const RIDER_AVAILABILITY = {
  available: 'Available' as AvailabilityLabel,
  onDelivery: 'OnDelivery' as AvailabilityLabel,
  unavailable: 'Unavailable' as AvailabilityLabel,
  suspended: 'Suspended' as AvailabilityLabel,
} as const
