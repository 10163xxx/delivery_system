import type { DeliveryWeatherTone } from '@/features/delivery/DeliveryRouteEstimates'

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
  endLabel: string
  endAddress: string
  statusLabel: string
  etaLabel?: string
  weatherTone?: DeliveryWeatherTone
  showRouteCurve?: boolean
  showDestinationMarker?: boolean
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
