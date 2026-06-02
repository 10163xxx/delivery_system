import type { AddressText } from '@/objects/core/SharedObjects'
import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'
import {
  DELIVERY_MAP_GEOCODE_RESULT_LIMIT,
  DELIVERY_MAP_GEOCODE_TIMEOUT_MS,
  DELIVERY_MAP_GEOCODE_URL,
} from '@/features/delivery/DeliveryMapSupport'

type GeocodeResult = {
  lat?: string
  lon?: string
}

const geocodeCache = new Map<string, DeliveryCoordinate | null>()

function normalizeAddress(value: AddressText | string) {
  return value.trim()
}

function buildGeocodeUrl(query: string) {
  const url = new URL(DELIVERY_MAP_GEOCODE_URL)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', String(DELIVERY_MAP_GEOCODE_RESULT_LIMIT))
  url.searchParams.set('accept-language', 'zh-CN')
  url.searchParams.set('q', query)
  return url.toString()
}

function parseCoordinate(result: GeocodeResult | undefined): DeliveryCoordinate | null {
  const latitude = Number(result?.lat)
  const longitude = Number(result?.lon)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return { latitude, longitude }
}

export async function geocodeDeliveryAddress(
  address: AddressText | string | undefined,
  signal?: AbortSignal,
) {
  const query = normalizeAddress(address ?? '')
  if (!query) return null
  if (geocodeCache.has(query)) return geocodeCache.get(query) ?? null

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), DELIVERY_MAP_GEOCODE_TIMEOUT_MS)
  const abortHandler = () => controller.abort()
  signal?.addEventListener('abort', abortHandler, { once: true })

  try {
    const response = await fetch(buildGeocodeUrl(query), { signal: controller.signal })
    if (!response.ok) return null
    const results = (await response.json()) as GeocodeResult[]
    const coordinate = parseCoordinate(results[0])
    geocodeCache.set(query, coordinate)
    return coordinate
  } catch {
    return null
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortHandler)
  }
}
