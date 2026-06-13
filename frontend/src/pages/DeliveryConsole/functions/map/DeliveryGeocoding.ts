// Address geocoding with cache and provider fallbacks for customer and store delivery locations.
import type { AddressText } from '@/objects/core/SharedObjects'
import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'
import type { RawTextValue } from '@/objects/core/SharedObjects'
import { DELIVERY_MAP_GEOCODE_TIMEOUT_MS } from '@/pages/DeliveryConsole/functions/map/DeliveryMapConstants'
import {
  fetchAmapCoordinate,
  fetchNominatimCoordinate,
  fetchPhotonCoordinate,
} from '@/pages/DeliveryConsole/functions/map/DeliveryGeocodingProviders'

const geocodeCache = new Map<RawTextValue, DeliveryCoordinate | null>()

function normalizeAddress(value: AddressText | RawTextValue) {
  return value.trim()
}

function normalizeCacheKey(query: RawTextValue) {
  return query.replace(/\s+/g, ' ').toLocaleLowerCase()
}

export async function geocodeDeliveryAddress(
  address: AddressText | RawTextValue | undefined,
  signal?: AbortSignal,
) {
  const query = normalizeAddress(address ?? '')
  if (!query) return null
  const cacheKey = normalizeCacheKey(query)
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey) ?? null

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), DELIVERY_MAP_GEOCODE_TIMEOUT_MS)
  const abortHandler = () => controller.abort()
  signal?.addEventListener('abort', abortHandler, { once: true })

  try {
    // Prefer Amap for Chinese delivery addresses, then fall back to public global providers.
    const coordinate =
      (await fetchAmapCoordinate(query, controller.signal)) ??
      (await fetchPhotonCoordinate(query, controller.signal)) ??
      (await fetchNominatimCoordinate(query, controller.signal))
    if (coordinate) {
      geocodeCache.set(cacheKey, coordinate)
      return coordinate
    }
    geocodeCache.set(cacheKey, null)
    return null
  } catch {
    if (!controller.signal.aborted) geocodeCache.set(cacheKey, null)
    return null
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortHandler)
  }
}
