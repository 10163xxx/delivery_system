// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AvailabilityLabel,
  PersonName,
  RiderId,
  VehicleLabel,
  ZoneLabel,
} from '@/objects/core/SharedObjects'

export type RiderIdentity = {
  id: RiderId
  name: PersonName
  vehicle: VehicleLabel
  zone: ZoneLabel
  availability: AvailabilityLabel
}
