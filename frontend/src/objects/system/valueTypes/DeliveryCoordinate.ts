// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
import type { Latitude } from './Latitude'
import type { Longitude } from './Longitude'

export type DeliveryCoordinate = {
  latitude: Latitude
  longitude: Longitude
}
