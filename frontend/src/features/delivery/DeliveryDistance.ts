import type { AddressText, CurrencyCents, Store } from '@/objects/core/SharedObjects'

export type DeliveryCoordinate = {
  latitude: number
  longitude: number
}

type DeliveryAddressCoordinateRule = {
  keyword: string
  coordinate: DeliveryCoordinate
}

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

const DELIVERY_DISTANCE_LIMIT_KM = 10
const DELIVERY_DISTANCE_COORDINATE_RULES: DeliveryAddressCoordinateRule[] = [
  { keyword: '上海市浦东新区世纪大道100号上海环球金融中心', coordinate: { latitude: 31.2367, longitude: 121.5026 } },
  { keyword: '上海市浦东新区世纪大道88号金茂大厦', coordinate: { latitude: 31.2356, longitude: 121.5062 } },
  { keyword: '上海市浦东新区张杨路188号汤臣中心', coordinate: { latitude: 31.2304, longitude: 121.5158 } },
  { keyword: '上海市黄浦区南京西路318号', coordinate: { latitude: 31.2302, longitude: 121.4647 } },
  { keyword: '上海市静安区吴江路269号', coordinate: { latitude: 31.2311, longitude: 121.4583 } },
  { keyword: '上海市静安区南京西路580号', coordinate: { latitude: 31.2293, longitude: 121.4593 } },
  { keyword: '上海市静安区愚园路246号', coordinate: { latitude: 31.2236, longitude: 121.4378 } },
  { keyword: '上海市浦东新区张杨路628号', coordinate: { latitude: 31.2286, longitude: 121.5164 } },
  { keyword: '上海市浦东新区世纪大道1200号', coordinate: { latitude: 31.2338, longitude: 121.5202 } },
  { keyword: '上海市浦东新区陆家嘴环路1088号', coordinate: { latitude: 31.2398, longitude: 121.5018 } },
  { keyword: '世纪大道 88 号', coordinate: { latitude: 31.2356, longitude: 121.5062 } },
  { keyword: '世纪大道 1200 号', coordinate: { latitude: 31.2338, longitude: 121.5202 } },
  { keyword: '世纪大道 1267 号', coordinate: { latitude: 31.2352, longitude: 121.5134 } },
  { keyword: '张杨路 188 号', coordinate: { latitude: 31.2304, longitude: 121.5158 } },
  { keyword: '张杨路 628 号', coordinate: { latitude: 31.2286, longitude: 121.5164 } },
  { keyword: '浦东南路 1118 号', coordinate: { latitude: 31.2254, longitude: 121.5178 } },
  { keyword: '浦东南路 855 号', coordinate: { latitude: 31.2292, longitude: 121.5149 } },
  { keyword: '陆家嘴环路 1088 号', coordinate: { latitude: 31.2398, longitude: 121.5018 } },
  { keyword: '南京西路 318 号', coordinate: { latitude: 31.2302, longitude: 121.4647 } },
  { keyword: '南京西路 580 号', coordinate: { latitude: 31.2293, longitude: 121.4593 } },
  { keyword: '南京西路 1038 号', coordinate: { latitude: 31.2278, longitude: 121.4511 } },
  { keyword: '静安寺', coordinate: { latitude: 31.2239, longitude: 121.4451 } },
  { keyword: '愚园路 246 号', coordinate: { latitude: 31.2236, longitude: 121.4378 } },
  { keyword: '吴江路 269 号', coordinate: { latitude: 31.2311, longitude: 121.4583 } },
  { keyword: '苏宁夜宵铺', coordinate: { latitude: 31.2311, longitude: 121.4583 } },
  { keyword: '苏宁咖啡甜点', coordinate: { latitude: 31.2293, longitude: 121.4593 } },
  { keyword: '苏宁奶茶研究所', coordinate: { latitude: 31.2236, longitude: 121.4378 } },
  { keyword: '王师傅面馆', coordinate: { latitude: 31.2286, longitude: 121.5164 } },
  { keyword: '王师傅盖饭', coordinate: { latitude: 31.2338, longitude: 121.5202 } },
  { keyword: '王师傅小炒', coordinate: { latitude: 31.2398, longitude: 121.5018 } },
]

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

export function getDeliveryAddressCoordinate(address: AddressText | string) {
  const rawAddress = address.trim()
  if (!rawAddress) return null
  return DELIVERY_DISTANCE_COORDINATE_RULES.find((rule) => rawAddress.includes(rule.keyword))?.coordinate ?? null
}

function calculateDistanceKm(left: DeliveryCoordinate, right: DeliveryCoordinate) {
  const earthRadiusKm = 6371
  const latitudeDelta = toRadians(right.latitude - left.latitude)
  const longitudeDelta = toRadians(right.longitude - left.longitude)
  const latitudeA = toRadians(left.latitude)
  const latitudeB = toRadians(right.latitude)
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine))
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

export function getStoreDeliveryQuote(store: Store, customerAddress: AddressText | string): StoreDeliveryQuote {
  const customerCoordinate = getDeliveryAddressCoordinate(customerAddress)
  const storeCoordinate = getDeliveryAddressCoordinate(store.storeAddress) ?? getDeliveryAddressCoordinate(store.name)
  const fallbackDistanceKm = 2.8
  const distanceKm =
    customerCoordinate && storeCoordinate
      ? Number(calculateDistanceKm(storeCoordinate, customerCoordinate).toFixed(1))
      : fallbackDistanceKm
  const deliveryFeeCents = getDeliveryFeeCents(distanceKm)

  return {
    deliveryFeeCents,
    distanceCategory: getDistanceCategory(distanceKm),
    distanceKm,
    distanceLabel: `${distanceKm.toFixed(1)} 公里`,
    isDeliverable: distanceKm <= DELIVERY_DISTANCE_LIMIT_KM,
  }
}

export function isDistanceCategory(value: string): value is StoreDeliveryDistanceCategory {
  return value === '3公里内' || value === '3-6公里' || value === '6-10公里' || value === '10公里外'
}

export function getDistanceCategoryOptions() {
  return ['3公里内', '3-6公里', '6-10公里', '10公里外'] as const
}
