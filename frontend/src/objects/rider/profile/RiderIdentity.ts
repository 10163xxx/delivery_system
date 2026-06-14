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
