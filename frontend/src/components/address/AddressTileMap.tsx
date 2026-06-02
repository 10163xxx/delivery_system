import { useEffect, useMemo, useRef, useState } from 'react'

import L, { type LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import type { DeliveryWeatherTone } from '@/features/delivery/DeliveryRouteEstimates'
import {
  geocodeDeliveryAddress,
} from '@/features/delivery/DeliveryGeocoding'
import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'
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
} from '@/features/delivery/DeliveryMapSupport'

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

function getCoordinateQuery(address?: string, query?: string) {
  return (address?.trim() || query?.trim() || '')
}

function toLatLng(coordinate: DeliveryCoordinate): LatLngExpression {
  return [coordinate.latitude, coordinate.longitude]
}

function sameCoordinate(left: DeliveryCoordinate | null, right: DeliveryCoordinate | null) {
  return left?.latitude === right?.latitude && left?.longitude === right?.longitude
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildPointLabel(label: string, tone: 'primary' | 'secondary') {
  const className = tone === 'primary' ? 'address-tile-map__leaflet-pin is-primary' : 'address-tile-map__leaflet-pin is-secondary'
  return L.divIcon({
    className,
    html: `<span class="address-tile-map__pin-dot"></span><span class="address-tile-map__pin-label">${escapeHtml(label)}</span>`,
    iconSize: [150, 34],
    iconAnchor: [8, 8],
  })
}

function buildEtaLabel(label: string, stageLabel?: string) {
  const stageMarkup = stageLabel
    ? `<span class="address-tile-map__eta-stage">${escapeHtml(stageLabel)}</span>`
    : ''
  return L.divIcon({
    className: 'address-tile-map__leaflet-eta',
    html: `<span class="address-tile-map__eta-card">${stageMarkup}<span class="address-tile-map__eta-time">${escapeHtml(label)}</span></span>`,
    iconSize: [180, 56],
    iconAnchor: [90, 28],
  })
}

function buildRoutePoints(
  primaryCoordinate: DeliveryCoordinate,
  secondaryCoordinate: DeliveryCoordinate,
) {
  const latitudeDelta = secondaryCoordinate.latitude - primaryCoordinate.latitude
  const longitudeDelta = secondaryCoordinate.longitude - primaryCoordinate.longitude
  const midpoint = {
    latitude: (primaryCoordinate.latitude + secondaryCoordinate.latitude) / 2,
    longitude: (primaryCoordinate.longitude + secondaryCoordinate.longitude) / 2,
  }
  const curveOffset = 0.18
  const controlPoint = {
    latitude: midpoint.latitude - longitudeDelta * curveOffset,
    longitude: midpoint.longitude + latitudeDelta * curveOffset,
  }

  return Array.from({ length: 25 }, (_, index) => {
    const t = index / 24
    const leftWeight = (1 - t) ** 2
    const centerWeight = 2 * (1 - t) * t
    const rightWeight = t ** 2
    return [
      leftWeight * primaryCoordinate.latitude +
        centerWeight * controlPoint.latitude +
        rightWeight * secondaryCoordinate.latitude,
      leftWeight * primaryCoordinate.longitude +
        centerWeight * controlPoint.longitude +
        rightWeight * secondaryCoordinate.longitude,
    ] as LatLngExpression
  })
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
  const [primaryCoordinate, setPrimaryCoordinate] = useState<DeliveryCoordinate | null>(primaryCoordinateProp ?? null)
  const [secondaryCoordinate, setSecondaryCoordinate] = useState<DeliveryCoordinate | null>(secondaryCoordinateProp ?? null)
  const [isLocating, setIsLocating] = useState(false)

  const primaryPoint = primaryCoordinate ? toLatLng(primaryCoordinate) : null
  const secondaryPoint = secondaryCoordinate ? toLatLng(secondaryCoordinate) : null

  useEffect(() => {
    const controller = new AbortController()
    if (primaryCoordinateProp || secondaryCoordinateProp) {
      setPrimaryCoordinate((current) =>
        sameCoordinate(current, primaryCoordinateProp ?? null) ? current : primaryCoordinateProp ?? null,
      )
      setSecondaryCoordinate((current) =>
        sameCoordinate(current, secondaryCoordinateProp ?? null) ? current : secondaryCoordinateProp ?? null,
      )
      setIsLocating(false)
      return () => {
        controller.abort()
      }
    }
    setIsLocating(true)

    Promise.all([
      geocodeDeliveryAddress(primaryQueryValue, controller.signal),
      showSecondaryMarker && secondaryQueryValue
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

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!primaryCoordinate && !secondaryCoordinate) return

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

    const markers: L.Layer[] = []
    if (primaryCoordinate && primaryPoint) {
      const primaryMarker = L.marker(toLatLng(primaryCoordinate), {
        icon: buildPointLabel(primaryLabel, 'primary'),
      }).addTo(map)
      markers.push(primaryMarker)
    }

    if (secondaryCoordinate && secondaryPoint && secondaryLabel && showSecondaryMarker) {
      const secondaryMarker = L.marker(toLatLng(secondaryCoordinate), {
        icon: buildPointLabel(secondaryLabel, 'secondary'),
      }).addTo(map)
      markers.push(secondaryMarker)

      if (primaryCoordinate && primaryPoint && showRouteCurve) {
        const route = L.polyline(buildRoutePoints(primaryCoordinate, secondaryCoordinate), {
          color: weatherTone === 'rainy' ? DELIVERY_MAP_ROUTE_COLOR_RAINY : DELIVERY_MAP_ROUTE_COLOR_CLEAR,
          weight: DELIVERY_MAP_ROUTE_WEIGHT,
          opacity: DELIVERY_MAP_ROUTE_OPACITY,
          dashArray: DELIVERY_MAP_ROUTE_DASH_ARRAY,
        }).addTo(map)
        markers.push(route)
        if (etaLabel) {
          const etaLat = (primaryCoordinate.latitude + secondaryCoordinate.latitude) / 2
          const etaLng = (primaryCoordinate.longitude + secondaryCoordinate.longitude) / 2
          L.marker([etaLat, etaLng], {
            icon: buildEtaLabel(etaLabel, etaStageLabel),
            interactive: false,
          }).addTo(map)
        }
      }
    }

    const allPoints = [
      ...(primaryPoint ? [primaryPoint] : []),
      ...(secondaryPoint ? [secondaryPoint] : []),
    ]
    if (allPoints.length > 1) {
      map.fitBounds(L.latLngBounds(allPoints).pad(0.25), { animate: false })
    } else if (allPoints.length === 1) {
      const singlePoint = allPoints[0]!
      map.setView(singlePoint, compact ? DELIVERY_MAP_COMPACT_ZOOM : DELIVERY_MAP_DEFAULT_ZOOM, { animate: false })
    } else {
      map.fitWorld({ animate: false })
    }

    return () => {
      markers.forEach((layer) => layer.remove())
      map.remove()
    }
  }, [
    compact,
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
