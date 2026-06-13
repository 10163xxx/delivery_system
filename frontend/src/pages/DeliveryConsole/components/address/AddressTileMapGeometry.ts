import L, { type LatLngExpression } from 'leaflet'
import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'

export function getCoordinateQuery(address?: string, query?: string) {
  return (address?.trim() || query?.trim() || '')
}

export function toLatLng(coordinate: DeliveryCoordinate): LatLngExpression {
  return [coordinate.latitude, coordinate.longitude]
}

export function sameCoordinate(left: DeliveryCoordinate | null, right: DeliveryCoordinate | null) {
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

export function buildPointLabel(label: string, tone: 'primary' | 'secondary') {
  const className = tone === 'primary' ? 'address-tile-map__leaflet-pin is-primary' : 'address-tile-map__leaflet-pin is-secondary'
  return L.divIcon({
    className,
    html: `<span class="address-tile-map__pin-dot"></span><span class="address-tile-map__pin-label">${escapeHtml(label)}</span>`,
    iconSize: [150, 34],
    iconAnchor: [8, 8],
  })
}

export function buildEtaLabel(label: string, stageLabel?: string) {
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

export function buildRoutePoints(
  primaryCoordinate: DeliveryCoordinate,
  secondaryCoordinate: DeliveryCoordinate,
) {
  // A quadratic curve keeps two nearby markers visually separate without implying exact routing.
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
