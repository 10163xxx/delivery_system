import type { DeliveryCoordinate } from '@/objects/system/valueTypes/DeliveryCoordinate'
import type { Latitude, Longitude } from '@/objects/core/SharedObjects'
import { asDomainNumber } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export type DeliveryCoordinateSystem = 'wgs84' | 'gcj02'

const PI = Math.PI
const A = 6378245
const EE = 0.006693421622965943

function isInMainlandChina(coordinate: DeliveryCoordinate) {
  return (
    coordinate.longitude >= 72.004 &&
    coordinate.longitude <= 137.8347 &&
    coordinate.latitude >= 0.8293 &&
    coordinate.latitude <= 55.8271
  )
}

function transformLatitude(x: number, y: number) {
  let result = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  result += ((20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2) / 3
  result += ((20 * Math.sin(y * PI) + 40 * Math.sin((y / 3) * PI)) * 2) / 3
  result += ((160 * Math.sin((y / 12) * PI) + 320 * Math.sin((y * PI) / 30)) * 2) / 3
  return result
}

function transformLongitude(x: number, y: number) {
  let result = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  result += ((20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2) / 3
  result += ((20 * Math.sin(x * PI) + 40 * Math.sin((x / 3) * PI)) * 2) / 3
  result += ((150 * Math.sin((x / 12) * PI) + 300 * Math.sin((x / 30) * PI)) * 2) / 3
  return result
}

export function gcj02ToWgs84(coordinate: DeliveryCoordinate): DeliveryCoordinate {
  if (!isInMainlandChina(coordinate)) return coordinate

  let deltaLatitude = transformLatitude(coordinate.longitude - 105, coordinate.latitude - 35)
  let deltaLongitude = transformLongitude(coordinate.longitude - 105, coordinate.latitude - 35)
  const radLatitude = (coordinate.latitude / 180) * PI
  let magic = Math.sin(radLatitude)
  magic = 1 - EE * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  deltaLatitude = (deltaLatitude * 180) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI)
  deltaLongitude = (deltaLongitude * 180) / ((A / sqrtMagic) * Math.cos(radLatitude) * PI)

  return {
    latitude: asDomainNumber<Latitude>(coordinate.latitude - deltaLatitude),
    longitude: asDomainNumber<Longitude>(coordinate.longitude - deltaLongitude),
  }
}

export function toMapCoordinate(
  coordinate: DeliveryCoordinate,
  sourceSystem: DeliveryCoordinateSystem,
) {
  if (sourceSystem === 'gcj02') return gcj02ToWgs84(coordinate)
  return coordinate
}
