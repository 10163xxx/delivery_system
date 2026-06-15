import type { RefObject } from 'react'
import type L from 'leaflet'
import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'
import type { DeliveryWeatherTone } from '@/pages/DeliveryConsole/functions/map/DeliveryRouteEstimates'

export type AddressTileMapProps = {
  primaryLabel: string
  primaryAddress: string
  primaryCoordinate?: DeliveryCoordinate
  primaryQuery?: string
  secondaryLabel?: string
  secondaryAddress?: string
  secondaryCoordinate?: DeliveryCoordinate
  secondaryQuery?: string
  etaStageLabel?: string
  etaLabel?: string
  compact?: boolean
  showRouteCurve?: boolean
  showSecondaryMarker?: boolean
  weatherTone?: DeliveryWeatherTone
}

export type AddressTileMapCoordinateParams = Pick<
  AddressTileMapProps,
  'primaryCoordinate' | 'secondaryCoordinate' | 'showSecondaryMarker'
> & {
  primaryQueryValue: string
  secondaryQueryValue: string
}

export type LeafletAddressMapParams = Pick<
  AddressTileMapProps,
  | 'compact'
  | 'etaLabel'
  | 'etaStageLabel'
  | 'primaryAddress'
  | 'primaryLabel'
  | 'secondaryAddress'
  | 'secondaryLabel'
  | 'showRouteCurve'
  | 'showSecondaryMarker'
  | 'weatherTone'
> & {
  containerRef: RefObject<HTMLDivElement | null>
  primaryCoordinate: DeliveryCoordinate | null
  secondaryCoordinate: DeliveryCoordinate | null
}

export type AddressMapLayerRenderArgs = Omit<LeafletAddressMapParams, 'compact' | 'containerRef'> & {
  map: L.Map
  primaryPoint: L.LatLngExpression | null
  secondaryPoint: L.LatLngExpression | null
}
