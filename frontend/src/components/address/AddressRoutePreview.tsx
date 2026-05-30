import { getDeliveryAddressCoordinate } from '@/features/delivery/DeliveryServices'
import type { AddressRoutePreview } from '@/components/address/AddressDetailsObjects'
import { buildAddressRouteEmbedUrl } from '@/components/address/AddressMapLinks'

type RoutePoint = {
  left: number
  top: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function getRouteBounds(startAddress: string, endAddress: string) {
  const startCoordinate = getDeliveryAddressCoordinate(startAddress)
  const endCoordinate = getDeliveryAddressCoordinate(endAddress)
  if (!startCoordinate || !endCoordinate) return null

  return {
    minLongitude: Math.min(startCoordinate.longitude, endCoordinate.longitude),
    maxLongitude: Math.max(startCoordinate.longitude, endCoordinate.longitude),
    minLatitude: Math.min(startCoordinate.latitude, endCoordinate.latitude),
    maxLatitude: Math.max(startCoordinate.latitude, endCoordinate.latitude),
    startCoordinate,
    endCoordinate,
  }
}

function mapCoordinateToPoint(
  coordinate: { latitude: number; longitude: number },
  bounds: NonNullable<ReturnType<typeof getRouteBounds>>,
): RoutePoint {
  const longitudeRange = Math.max(bounds.maxLongitude - bounds.minLongitude, 0.002)
  const latitudeRange = Math.max(bounds.maxLatitude - bounds.minLatitude, 0.002)
  const left = ((coordinate.longitude - bounds.minLongitude) / longitudeRange) * 72 + 14
  const top = 86 - ((coordinate.latitude - bounds.minLatitude) / latitudeRange) * 72

  return {
    left: clamp(left, 10, 90),
    top: clamp(top, 12, 88),
  }
}

function buildRoutePath(start: RoutePoint, end: RoutePoint) {
  const horizontalDelta = end.left - start.left
  const verticalDelta = end.top - start.top
  const bend = clamp(Math.abs(horizontalDelta) * 0.28 + Math.abs(verticalDelta) * 0.18, 12, 28)
  const direction = horizontalDelta >= 0 ? -1 : 1
  const controlOne = {
    x: start.left + horizontalDelta * 0.28,
    y: start.top + verticalDelta * 0.16 + bend * direction,
  }
  const controlTwo = {
    x: start.left + horizontalDelta * 0.72,
    y: start.top + verticalDelta * 0.84 + bend * direction,
  }

  return `M ${start.left} ${start.top} C ${controlOne.x} ${controlOne.y}, ${controlTwo.x} ${controlTwo.y}, ${end.left} ${end.top}`
}

function RouteMarker({
  kind,
  label,
  address,
  point,
}: {
  kind: 'start' | 'end'
  label: string
  address: string
  point: RoutePoint
}) {
  return (
    <div
      className={`address-route-preview__marker is-${kind}`}
      style={{ left: `${point.left}%`, top: `${point.top}%` }}
    >
      <span className={`address-route-preview__pin is-${kind}`} />
      <div className="address-route-preview__marker-copy">
        <strong>{label}</strong>
        <small>{address}</small>
      </div>
    </div>
  )
}

export function AddressRoutePreviewMap({ preview }: { preview: AddressRoutePreview }) {
  const bounds = getRouteBounds(preview.startAddress, preview.endAddress)
  const mapUrl = buildAddressRouteEmbedUrl(preview.startAddress, preview.endAddress)
  const startPoint = bounds ? mapCoordinateToPoint(bounds.startCoordinate, bounds) : null
  const endPoint = bounds ? mapCoordinateToPoint(bounds.endCoordinate, bounds) : null
  const shouldShowRoute = preview.showRouteCurve ?? Boolean(startPoint && endPoint)
  const shouldShowDestination = preview.showDestinationMarker ?? true
  const routePath = startPoint && endPoint && shouldShowRoute ? buildRoutePath(startPoint, endPoint) : null

  return (
    <section className={`address-route-preview${preview.weatherTone === 'rainy' ? ' is-rainy' : ''}`}>
      <div className="address-route-preview__header">
        <div>
          <p className="ticket-kind">配送路线</p>
          <h3>{preview.statusLabel}</h3>
        </div>
        {preview.etaLabel ? <span className="badge">{preview.etaLabel}</span> : null}
      </div>
      <p className="address-route-preview__summary">
        {preview.startLabel}到{preview.endLabel}的真实地址已加载，地图会随订单状态自动显示当前路径。
      </p>
      <div className="address-route-preview__map">
        {mapUrl ? (
          <iframe
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            title="配送路线地图"
          />
        ) : (
          <div className="address-route-preview__fallback">地址已匹配，但地图定位暂不可用。</div>
        )}
        {routePath ? (
          <svg
            aria-hidden="true"
            className="address-route-preview__overlay"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d={routePath} />
          </svg>
        ) : null}
        {startPoint ? (
          <RouteMarker kind="start" label={preview.startLabel} address={preview.startAddress} point={startPoint} />
        ) : null}
        {shouldShowDestination && endPoint ? (
          <RouteMarker kind="end" label={preview.endLabel} address={preview.endAddress} point={endPoint} />
        ) : null}
      </div>
    </section>
  )
}
