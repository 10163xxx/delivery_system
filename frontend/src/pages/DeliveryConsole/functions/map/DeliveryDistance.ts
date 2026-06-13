import type {
  AddressEntry,
  AddressText,
  CurrencyCents,
  Customer,
  Store,
} from '@/objects/core/SharedObjects'
import {
  DELIVERY_DISTANCE_LIMIT_KM,
  DELIVERY_EARTH_RADIUS_KM,
} from '@/pages/DeliveryConsole/functions/map/DeliveryMapConstants'
import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'

export type StoreDeliveryDistanceCategory =
  | '3公里内'
  | '3-6公里'
  | '6-10公里'
  | '10公里外'

export type StoreDeliveryQuote = {
  deliveryFeeCents: CurrencyCents
  distanceCategory: StoreDeliveryDistanceCategory
  distanceKm: number
  distanceLabel: string
  isDeliverable: boolean
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function calculateDistanceKm(left: DeliveryCoordinate, right: DeliveryCoordinate) {
  const latitudeDelta = toRadians(right.latitude - left.latitude)
  const longitudeDelta = toRadians(right.longitude - left.longitude)
  const latitudeA = toRadians(left.latitude)
  const latitudeB = toRadians(right.latitude)
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2

  return 2 * DELIVERY_EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine))
}

function getDistanceCategory(distanceKm: number): StoreDeliveryDistanceCategory {
  if (distanceKm <= 3) return '3公里内'
  if (distanceKm <= 6) return '3-6公里'
  if (distanceKm <= DELIVERY_DISTANCE_LIMIT_KM) return '6-10公里'
  return '10公里外'
}

function getDeliveryFeeCents(distanceKm: number): CurrencyCents {
  if (distanceKm <= 3) return 600 as CurrencyCents
  if (distanceKm <= 6) return 900 as CurrencyCents
  if (distanceKm <= DELIVERY_DISTANCE_LIMIT_KM) return 1400 as CurrencyCents
  return 1800 as CurrencyCents
}

export function getCustomerAddressCoordinate(
  customer: Customer | undefined,
  address: AddressText | string,
) {
  const normalizedAddress = address.trim()
  if (!customer || !normalizedAddress) return undefined
  return customer.addresses.find((entry: AddressEntry) => entry.address === normalizedAddress)?.location
}

export function getStoreDeliveryQuote(
  store: Store,
  customerCoordinate: DeliveryCoordinate | undefined,
): StoreDeliveryQuote {
  const distanceKm =
    customerCoordinate && store.location
      ? Number(calculateDistanceKm(store.location, customerCoordinate).toFixed(1))
      : Number.POSITIVE_INFINITY
  const deliveryFeeCents = getDeliveryFeeCents(distanceKm)

  return {
    deliveryFeeCents,
    distanceCategory: getDistanceCategory(distanceKm),
    distanceKm,
    distanceLabel: Number.isFinite(distanceKm) ? `${distanceKm.toFixed(1)} 公里` : '未定位',
    isDeliverable: Number.isFinite(distanceKm) && distanceKm <= DELIVERY_DISTANCE_LIMIT_KM,
  }
}

export function isDistanceCategory(value: string): value is StoreDeliveryDistanceCategory {
  return value === '3公里内' || value === '3-6公里' || value === '6-10公里' || value === '10公里外'
}

export function getDistanceCategoryOptions() {
  return ['3公里内', '3-6公里', '6-10公里', '10公里外'] as const
}
