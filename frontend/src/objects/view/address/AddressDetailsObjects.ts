// Cross-page address UI view models. These types are frontend-only and do not
// mirror backend protocol objects; they shape data for shared address components.
import type { DeliveryWeatherTone } from '@/pages/DeliveryConsole/functions/map/DeliveryRouteEstimates'
import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'

export type AddressDetailsMetric = {
  label: string
  value: string
}

export type AddressDetailsField = {
  label: string
  value: string
  mapQuery?: string
  mapVariant?: 'compact' | 'large'
  weatherTone?: DeliveryWeatherTone
  hint?: string
}

export type AddressRoutePreview = {
  startLabel: string
  startAddress: string
  startCoordinate?: DeliveryCoordinate
  startQuery?: string
  endLabel?: string
  endAddress?: string
  endCoordinate?: DeliveryCoordinate
  endQuery?: string
  statusLabel: string
  etaLabel?: string
  weatherTone?: DeliveryWeatherTone
  showRouteCurve?: boolean
  showDestinationMarker?: boolean
  compact?: boolean
}

export type AddressDetailsRecord = {
  id: string
  title: string
  subtitle: string
  status?: string
  fields: AddressDetailsField[]
}

export type AddressDetailsCardData = {
  eyebrow: string
  title: string
  summary: string
  metrics: AddressDetailsMetric[]
  weatherTone?: DeliveryWeatherTone
  weatherLabel?: string
  routePreview?: AddressRoutePreview
  records: AddressDetailsRecord[]
  emptyText: string
}
