// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { AvailabilityLabel } from '@/objects/core/SharedObjects'

export type UpdateRiderAvailabilityRequest = {
  availability: AvailabilityLabel
}
