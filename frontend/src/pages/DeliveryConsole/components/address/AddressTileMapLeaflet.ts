import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
  buildEtaLabel,
  buildPointLabel,
  buildRoutePoints,
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
import type {
  AddressMapLayerRenderArgs,
  LeafletAddressMapParams,
} from '@/pages/DeliveryConsole/components/address/AddressTileMapTypes'

export function useLeafletAddressMap(params: LeafletAddressMapParams) {
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

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!primaryCoordinate && !secondaryCoordinate) return

    const primaryPoint = primaryCoordinate ? toLatLng(primaryCoordinate) : null
    const secondaryPoint = secondaryCoordinate ? toLatLng(secondaryCoordinate) : null
    const map = createLeafletMap(container, compact)
    const markers = renderAddressMapLayers({
      etaLabel,
      etaStageLabel,
      map,
      primaryAddress,
      primaryCoordinate,
      primaryLabel,
      primaryPoint,
      secondaryAddress,
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

function renderAddressMapLayers(args: AddressMapLayerRenderArgs) {
  const markers: L.Layer[] = []
  renderPrimaryMarker(args, markers)
  renderSecondaryMarker(args, markers)
  return markers
}

function renderPrimaryMarker(args: AddressMapLayerRenderArgs, markers: L.Layer[]) {
  if (!args.primaryCoordinate || !args.primaryPoint) return
  markers.push(
    L.marker(toLatLng(args.primaryCoordinate), {
      icon: buildPointLabel(args.primaryLabel, 'primary'),
    }).addTo(args.map),
  )
}

function renderSecondaryMarker(args: AddressMapLayerRenderArgs, markers: L.Layer[]) {
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

function renderRouteLayer(args: AddressMapLayerRenderArgs, markers: L.Layer[]) {
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
  renderEtaMarker(args, markers)
}

function renderEtaMarker(args: AddressMapLayerRenderArgs, markers: L.Layer[]) {
  const { etaLabel, etaStageLabel, primaryCoordinate, secondaryCoordinate } = args
  if (!etaLabel || !primaryCoordinate || !secondaryCoordinate) return
  const etaLat = (primaryCoordinate.latitude + secondaryCoordinate.latitude) / 2
  const etaLng = (primaryCoordinate.longitude + secondaryCoordinate.longitude) / 2
  markers.push(
    L.marker([etaLat, etaLng], {
      icon: buildEtaLabel(etaLabel, etaStageLabel),
      interactive: false,
    }).addTo(args.map),
  )
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
