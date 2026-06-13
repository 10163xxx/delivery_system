import { useEffect, useMemo, useRef, useState } from 'react'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import type { DeliveryWeatherTone } from '@/pages/DeliveryConsole/functions/map/DeliveryRouteEstimates'
import { geocodeDeliveryAddress } from '@/pages/DeliveryConsole/functions/map/DeliveryGeocoding'
import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'
import {
  buildEtaLabel,
  buildPointLabel,
  buildRoutePoints,
  getCoordinateQuery,
  sameCoordinate,
  toLatLng,
} from '@/pages/DeliveryConsole/components/address/AddressTileMapGeometry'
import {
  DELIVERY_MAP_ATTRIBUTION,
  DELIVERY_MAP_COMPACT_ZOOM,
  DELIVERY_MAP_DEFAULT_ZOOM,
  DELIVERY_MAP_MAX_ZOOM,
  DELIVERY_MAP_ROUTE_DASH_ARRAY,
  DELIVERY_MAP_ROUTE_COLOR_CLEAR,
  DELIVERY_MAP_ROUTE_COLOR_RAINY,
  DELIVERY_MAP_ROUTE_OPACITY,
  DELIVERY_MAP_ROUTE_WEIGHT,
  DELIVERY_MAP_TILE_URL,
} from '@/pages/DeliveryConsole/functions/map/DeliveryMapConstants'

// This component renders coordinates and delegates all provider selection to geocoding.
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

type AddressTileMapCoordinateParams = Pick<
  AddressTileMapProps,
  'primaryCoordinate' | 'secondaryCoordinate' | 'showSecondaryMarker'
> & {
  primaryQueryValue: string
  secondaryQueryValue: string
}

function useAddressTileMapCoordinates(params: AddressTileMapCoordinateParams) {
  const {
    primaryCoordinate: primaryCoordinateProp,
    primaryQueryValue,
    secondaryCoordinate: secondaryCoordinateProp,
    secondaryQueryValue,
    showSecondaryMarker,
  } = params
  const [primaryCoordinate, setPrimaryCoordinate] = useState<DeliveryCoordinate | null>(primaryCoordinateProp ?? null)
  const [secondaryCoordinate, setSecondaryCoordinate] = useState<DeliveryCoordinate | null>(secondaryCoordinateProp ?? null)
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setIsLocating(true)

    Promise.all([
      primaryCoordinateProp
        ? Promise.resolve(primaryCoordinateProp)
        : geocodeDeliveryAddress(primaryQueryValue, controller.signal),
      secondaryCoordinateProp
        ? Promise.resolve(secondaryCoordinateProp)
        : showSecondaryMarker && secondaryQueryValue
          ? geocodeDeliveryAddress(secondaryQueryValue, controller.signal)
          : Promise.resolve(null),
    ])
      .then(([nextPrimaryCoordinate, nextSecondaryCoordinate]) => {
        if (controller.signal.aborted) return
        setPrimaryCoordinate((current) =>
          sameCoordinate(current, nextPrimaryCoordinate) ? current : nextPrimaryCoordinate,
        )
        setSecondaryCoordinate((current) =>
          sameCoordinate(current, nextSecondaryCoordinate) ? current : nextSecondaryCoordinate,
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLocating(false)
      })

    return () => {
      controller.abort()
    }
  }, [
    primaryCoordinateProp,
    primaryQueryValue,
    secondaryCoordinateProp,
    secondaryQueryValue,
    showSecondaryMarker,
  ])

  return {
    isLocating,
    primaryCoordinate,
    secondaryCoordinate,
  }
}

type LeafletAddressMapParams = Pick<
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
  containerRef: React.RefObject<HTMLDivElement | null>
  primaryCoordinate: DeliveryCoordinate | null
  secondaryCoordinate: DeliveryCoordinate | null
}

function useLeafletAddressMap(params: LeafletAddressMapParams) {
  const {
    compact,
    containerRef,
    etaLabel,
    etaStageLabel,
    primaryAddress,
    primaryCoordinate,
    primaryLabel,
    secondaryAddress,
    secondaryCoordinate,
    secondaryLabel,
    showRouteCurve,
    showSecondaryMarker,
    weatherTone,
  } = params
  const primaryPoint = primaryCoordinate ? toLatLng(primaryCoordinate) : null
  const secondaryPoint = secondaryCoordinate ? toLatLng(secondaryCoordinate) : null

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!primaryCoordinate && !secondaryCoordinate) return

    const map = createLeafletMap(container, compact)
    const markers = renderAddressMapLayers({
      etaLabel,
      etaStageLabel,
      map,
      primaryCoordinate,
      primaryLabel,
      primaryPoint,
      secondaryCoordinate,
      secondaryLabel,
      secondaryPoint,
      showRouteCurve,
      showSecondaryMarker,
      weatherTone,
    })
    fitAddressMapBounds(map, compact, primaryPoint, secondaryPoint)

    return () => {
      markers.forEach((layer) => layer.remove())
      map.remove()
    }
  }, [
    compact,
    containerRef,
    etaLabel,
    etaStageLabel,
    primaryAddress,
    primaryCoordinate,
    primaryLabel,
    secondaryAddress,
    secondaryCoordinate,
    secondaryLabel,
    showRouteCurve,
    showSecondaryMarker,
    weatherTone,
  ])
}

function createLeafletMap(container: HTMLDivElement, compact: boolean | undefined) {
  const map = L.map(container, {
    zoom: compact ? DELIVERY_MAP_COMPACT_ZOOM : DELIVERY_MAP_DEFAULT_ZOOM,
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: false,
  })
  L.tileLayer(DELIVERY_MAP_TILE_URL, {
    maxZoom: DELIVERY_MAP_MAX_ZOOM,
    attribution: DELIVERY_MAP_ATTRIBUTION,
  }).addTo(map)
  return map
}

function renderAddressMapLayers(args: {
  etaLabel: string | undefined
  etaStageLabel: string | undefined
  map: L.Map
  primaryCoordinate: DeliveryCoordinate | null
  primaryLabel: string
  primaryPoint: L.LatLngExpression | null
  secondaryCoordinate: DeliveryCoordinate | null
  secondaryLabel: string | undefined
  secondaryPoint: L.LatLngExpression | null
  showRouteCurve: boolean | undefined
  showSecondaryMarker: boolean | undefined
  weatherTone: DeliveryWeatherTone | undefined
}) {
  const markers: L.Layer[] = []
  renderPrimaryMarker(args, markers)
  renderSecondaryMarker(args, markers)
  return markers
}

function renderPrimaryMarker(args: Parameters<typeof renderAddressMapLayers>[0], markers: L.Layer[]) {
  if (!args.primaryCoordinate || !args.primaryPoint) return
  markers.push(
    L.marker(toLatLng(args.primaryCoordinate), {
      icon: buildPointLabel(args.primaryLabel, 'primary'),
    }).addTo(args.map),
  )
}

function renderSecondaryMarker(args: Parameters<typeof renderAddressMapLayers>[0], markers: L.Layer[]) {
  const {
    secondaryCoordinate,
    secondaryLabel,
    secondaryPoint,
    showSecondaryMarker,
  } = args
  if (!secondaryCoordinate || !secondaryPoint || !secondaryLabel || !showSecondaryMarker) return
  markers.push(
    L.marker(toLatLng(secondaryCoordinate), {
      icon: buildPointLabel(secondaryLabel, 'secondary'),
    }).addTo(args.map),
  )
  renderRouteLayer(args, markers)
}

function renderRouteLayer(args: Parameters<typeof renderAddressMapLayers>[0], markers: L.Layer[]) {
  const { primaryCoordinate, primaryPoint, secondaryCoordinate, showRouteCurve } = args
  if (!primaryCoordinate || !primaryPoint || !secondaryCoordinate || !showRouteCurve) return
  markers.push(
    L.polyline(buildRoutePoints(primaryCoordinate, secondaryCoordinate), {
      color: args.weatherTone === 'rainy' ? DELIVERY_MAP_ROUTE_COLOR_RAINY : DELIVERY_MAP_ROUTE_COLOR_CLEAR,
      weight: DELIVERY_MAP_ROUTE_WEIGHT,
      opacity: DELIVERY_MAP_ROUTE_OPACITY,
      dashArray: DELIVERY_MAP_ROUTE_DASH_ARRAY,
    }).addTo(args.map),
  )
  renderEtaMarker(args)
}

function renderEtaMarker(args: Parameters<typeof renderAddressMapLayers>[0]) {
  const { etaLabel, etaStageLabel, primaryCoordinate, secondaryCoordinate } = args
  if (!etaLabel || !primaryCoordinate || !secondaryCoordinate) return
  const etaLat = (primaryCoordinate.latitude + secondaryCoordinate.latitude) / 2
  const etaLng = (primaryCoordinate.longitude + secondaryCoordinate.longitude) / 2
  L.marker([etaLat, etaLng], {
    icon: buildEtaLabel(etaLabel, etaStageLabel),
    interactive: false,
  }).addTo(args.map)
}

function fitAddressMapBounds(
  map: L.Map,
  compact: boolean | undefined,
  primaryPoint: L.LatLngExpression | null,
  secondaryPoint: L.LatLngExpression | null,
) {
  const allPoints = [
    ...(primaryPoint ? [primaryPoint] : []),
    ...(secondaryPoint ? [secondaryPoint] : []),
  ]
  if (allPoints.length > 1) {
    map.fitBounds(L.latLngBounds(allPoints).pad(0.25), { animate: false })
  } else if (allPoints.length === 1) {
    map.setView(allPoints[0]!, compact ? DELIVERY_MAP_COMPACT_ZOOM : DELIVERY_MAP_DEFAULT_ZOOM, { animate: false })
  } else {
    map.fitWorld({ animate: false })
  }
}

export function AddressTileMap({
  primaryLabel,
  primaryAddress,
  primaryCoordinate: primaryCoordinateProp,
  primaryQuery,
  secondaryLabel,
  secondaryAddress,
  secondaryCoordinate: secondaryCoordinateProp,
  secondaryQuery,
  etaStageLabel,
  etaLabel,
  compact,
  showRouteCurve,
  showSecondaryMarker,
  weatherTone,
}: AddressTileMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const primaryQueryValue = useMemo(
    () => getCoordinateQuery(primaryAddress, primaryQuery ?? primaryLabel),
    [primaryAddress, primaryLabel, primaryQuery],
  )
  const secondaryQueryValue = useMemo(
    () => getCoordinateQuery(secondaryAddress, secondaryQuery ?? secondaryLabel),
    [secondaryAddress, secondaryLabel, secondaryQuery],
  )
  const { isLocating, primaryCoordinate, secondaryCoordinate } = useAddressTileMapCoordinates({
    primaryCoordinate: primaryCoordinateProp,
    primaryQueryValue,
    secondaryCoordinate: secondaryCoordinateProp,
    secondaryQueryValue,
    showSecondaryMarker,
  })
  useLeafletAddressMap({
    compact,
    containerRef,
    etaLabel,
    etaStageLabel,
    primaryAddress,
    primaryCoordinate,
    primaryLabel,
    secondaryAddress,
    secondaryCoordinate,
    secondaryLabel,
    showRouteCurve,
    showSecondaryMarker,
    weatherTone,
  })

  return (
    <div className="address-tile-map-frame">
      {primaryCoordinate || secondaryCoordinate ? (
        <div
          ref={containerRef}
          className={`address-tile-map${weatherTone === 'rainy' ? ' is-rainy' : ''}${compact ? ' is-compact' : ''}`}
        />
      ) : (
        <div className={`address-tile-map address-tile-map__placeholder${compact ? ' is-compact' : ''}`} />
      )}
      {isLocating ? <span className="address-tile-map__status">定位中</span> : null}
      {!isLocating && !primaryCoordinate ? (
        <span className="address-tile-map__status is-warning">当前地址暂未定位</span>
      ) : null}
      {!isLocating && showSecondaryMarker && !secondaryCoordinate ? (
        <span className="address-tile-map__status is-warning">商家地址暂未定位</span>
      ) : null}
    </div>
  )
}
