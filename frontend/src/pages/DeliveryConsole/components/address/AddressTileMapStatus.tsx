import type { DeliveryCoordinate } from '@/objects/domain/DeliveryCoordinate'

export function AddressTileMapStatus({
  isLocating,
  primaryCoordinate,
  secondaryCoordinate,
  showSecondaryMarker,
}: {
  isLocating: boolean
  primaryCoordinate: DeliveryCoordinate | null
  secondaryCoordinate: DeliveryCoordinate | null
  showSecondaryMarker?: boolean
}) {
  if (isLocating) return <span className="address-tile-map__status">定位中</span>

  if (!primaryCoordinate) {
    return <span className="address-tile-map__status is-warning">当前地址暂未定位</span>
  }

  if (showSecondaryMarker && !secondaryCoordinate) {
    return <span className="address-tile-map__status is-warning">商家地址暂未定位</span>
  }

  return null
}
