import type { DeliveryCoordinate } from '@/objects/system/valueTypes/DeliveryCoordinate'
import type { Latitude, Longitude, RawNumericValue, RawTextValue } from '@/objects/core/SharedObjects'
import { asDomainNumber } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { toMapCoordinate } from '@/pages/DeliveryConsole/functions/map/DeliveryCoordinateSystem'
import {
  DELIVERY_MAP_GEOCODE_RESULT_LIMIT,
  DELIVERY_MAP_GEOCODE_PROVIDER_RESULT_LIMIT,
  DELIVERY_MAP_GEOCODE_URL,
} from '@/pages/DeliveryConsole/functions/map/DeliveryMapConstants'

type NominatimGeocodeResult = {
  lat?: RawTextValue
  lon?: RawTextValue
}

type PhotonFeature = {
  geometry?: {
    coordinates?: [RawNumericValue, RawNumericValue]
  }
}

type PhotonGeocodeResult = {
  features?: PhotonFeature[]
}

type AmapGeocodeResult = {
  status?: RawTextValue
  geocodes?: Array<{
    location?: RawTextValue
  }>
}

const AMAP_GEOCODE_URL = 'https://restapi.amap.com/v3/geocode/geo'
const AMAP_SUCCESS_STATUS = '1'
const PHOTON_GEOCODE_URL = 'https://photon.komoot.io/api/'
const amapWebServiceKey = import.meta.env['VITE_AMAP_WEB_SERVICE_KEY'] as RawTextValue | undefined

function deliveryCoordinate(latitude: RawNumericValue, longitude: RawNumericValue): DeliveryCoordinate {
  return {
    latitude: asDomainNumber<Latitude>(latitude),
    longitude: asDomainNumber<Longitude>(longitude),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNominatimGeocodeResult(value: unknown): value is NominatimGeocodeResult {
  if (!isRecord(value)) return false
  return (
    (typeof value['lat'] === 'string' || value['lat'] === undefined) &&
    (typeof value['lon'] === 'string' || value['lon'] === undefined)
  )
}

function decodeNominatimGeocodeResults(value: unknown): NominatimGeocodeResult[] {
  return Array.isArray(value) ? value.filter(isNominatimGeocodeResult) : []
}

function isPhotonFeature(value: unknown): value is PhotonFeature {
  if (!isRecord(value)) return false
  const geometry = value['geometry']
  if (!isRecord(geometry)) return false
  const coordinates = geometry['coordinates']
  return (
    Array.isArray(coordinates) &&
    coordinates.length >= 2 &&
    typeof coordinates[0] === 'number' &&
    typeof coordinates[1] === 'number'
  )
}

function decodePhotonGeocodeResult(value: unknown): PhotonGeocodeResult {
  if (!isRecord(value)) return {}
  const features = value['features']
  return {
    features: Array.isArray(features) ? features.filter(isPhotonFeature) : [],
  }
}

function isAmapGeocodeEntry(value: unknown): value is { location?: RawTextValue } {
  return isRecord(value) && (typeof value['location'] === 'string' || value['location'] === undefined)
}

function decodeAmapGeocodeResult(value: unknown): AmapGeocodeResult {
  if (!isRecord(value)) return {}
  const geocodes = value['geocodes']
  return {
    status: typeof value['status'] === 'string' ? value['status'] : undefined,
    geocodes: Array.isArray(geocodes) ? geocodes.filter(isAmapGeocodeEntry) : [],
  }
}

function buildNominatimGeocodeUrl(query: RawTextValue) {
  const url = new URL(DELIVERY_MAP_GEOCODE_URL)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set(
    'limit',
    String(Math.max(DELIVERY_MAP_GEOCODE_RESULT_LIMIT, DELIVERY_MAP_GEOCODE_PROVIDER_RESULT_LIMIT)),
  )
  url.searchParams.set('accept-language', 'zh-CN')
  url.searchParams.set('q', query)
  return url.toString()
}

function buildPhotonGeocodeUrl(query: RawTextValue) {
  const url = new URL(PHOTON_GEOCODE_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', String(DELIVERY_MAP_GEOCODE_PROVIDER_RESULT_LIMIT))
  url.searchParams.set('lang', 'zh')
  return url.toString()
}

function parseNominatimCoordinate(result: NominatimGeocodeResult | undefined): DeliveryCoordinate | null {
  const latitude = Number(result?.lat)
  const longitude = Number(result?.lon)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return deliveryCoordinate(latitude, longitude)
}

// Amap performs better with a city hint, but the rest of the geocoding flow avoids
// parsing address structure because non-Amap providers are unreliable for that data.
function extractChineseCity(query: RawTextValue) {
  return query.match(/([\u3400-\u9fff]{2,}(?:市|自治州|地区|盟))/)?.[1]
}

function parsePhotonCoordinate(feature: PhotonFeature | undefined): DeliveryCoordinate | null {
  const coordinates = feature?.geometry?.coordinates
  const longitude = coordinates?.[0]
  const latitude = coordinates?.[1]
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null
  }
  return deliveryCoordinate(latitude, longitude)
}

function buildAmapGeocodeUrl(query: RawTextValue, key: RawTextValue) {
  const url = new URL(AMAP_GEOCODE_URL)
  url.searchParams.set('key', key)
  url.searchParams.set('address', query)
  url.searchParams.set('output', 'json')
  const city = extractChineseCity(query)
  if (city) url.searchParams.set('city', city)
  return url.toString()
}

function parseAmapCoordinate(location: RawTextValue | undefined): DeliveryCoordinate | null {
  const [longitudeValue, latitudeValue] = location?.split(',') ?? []
  const latitude = Number(latitudeValue)
  const longitude = Number(longitudeValue)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return deliveryCoordinate(latitude, longitude)
}

export async function fetchNominatimCoordinate(query: RawTextValue, signal: AbortSignal) {
  const response = await fetch(buildNominatimGeocodeUrl(query), { signal })
  if (!response.ok) return null
  const results = decodeNominatimGeocodeResults(await response.json())
  return results.map(parseNominatimCoordinate).find(Boolean) ?? null
}

export async function fetchAmapCoordinate(query: RawTextValue, signal: AbortSignal) {
  if (!amapWebServiceKey) return null
  const response = await fetch(buildAmapGeocodeUrl(query, amapWebServiceKey), { signal })
  if (!response.ok) return null
  const result = decodeAmapGeocodeResult(await response.json())
  if (result.status !== AMAP_SUCCESS_STATUS) return null
  const coordinate = parseAmapCoordinate(result.geocodes?.[0]?.location)
  return coordinate ? toMapCoordinate(coordinate, 'gcj02') : null
}

// Public providers return different shapes, so each fallback only accepts a
// parseable coordinate and leaves relevance scoring to provider ranking.
export async function fetchPhotonCoordinate(query: RawTextValue, signal: AbortSignal) {
  const response = await fetch(buildPhotonGeocodeUrl(query), { signal })
  if (!response.ok) return null
  const result = decodePhotonGeocodeResult(await response.json())
  return result.features?.map(parsePhotonCoordinate).find(Boolean) ?? null
}
