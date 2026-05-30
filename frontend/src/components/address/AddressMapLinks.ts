import { getDeliveryAddressCoordinate } from '@/features/delivery/DeliveryServices'

const OPEN_STREET_MAP_EMBED_URL = 'https://www.openstreetmap.org/export/embed.html'
const MAP_BOUNDING_BOX_DELTA = 0.01

function normalizeMapQuery(value: string) {
  return value.trim()
}

export function buildAddressMapEmbedUrl(value: string) {
  const query = normalizeMapQuery(value)
  if (!query) return undefined
  const coordinate = getDeliveryAddressCoordinate(query)
  if (!coordinate) return undefined

  const bbox = [
    coordinate.longitude - MAP_BOUNDING_BOX_DELTA,
    coordinate.latitude - MAP_BOUNDING_BOX_DELTA,
    coordinate.longitude + MAP_BOUNDING_BOX_DELTA,
    coordinate.latitude + MAP_BOUNDING_BOX_DELTA,
  ].join(',')
  const params = new URLSearchParams({
    bbox,
    layer: 'mapnik',
    marker: `${coordinate.latitude},${coordinate.longitude}`,
  })

  return `${OPEN_STREET_MAP_EMBED_URL}?${params.toString()}`
}

export function buildAddressRouteEmbedUrl(startValue: string, endValue: string) {
  const startQuery = normalizeMapQuery(startValue)
  const endQuery = normalizeMapQuery(endValue)
  if (!startQuery || !endQuery) return undefined

  const startCoordinate = getDeliveryAddressCoordinate(startQuery)
  const endCoordinate = getDeliveryAddressCoordinate(endQuery)
  if (!startCoordinate || !endCoordinate) return undefined

  const minLongitude = Math.min(startCoordinate.longitude, endCoordinate.longitude) - MAP_BOUNDING_BOX_DELTA
  const minLatitude = Math.min(startCoordinate.latitude, endCoordinate.latitude) - MAP_BOUNDING_BOX_DELTA
  const maxLongitude = Math.max(startCoordinate.longitude, endCoordinate.longitude) + MAP_BOUNDING_BOX_DELTA
  const maxLatitude = Math.max(startCoordinate.latitude, endCoordinate.latitude) + MAP_BOUNDING_BOX_DELTA
  const params = new URLSearchParams({
    bbox: [minLongitude, minLatitude, maxLongitude, maxLatitude].join(','),
    layer: 'mapnik',
    marker: `${startCoordinate.latitude},${startCoordinate.longitude}`,
  })

  return `${OPEN_STREET_MAP_EMBED_URL}?${params.toString()}`
}
