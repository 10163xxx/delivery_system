import { AddressTileMap } from '@/pages/DeliveryConsole/components/address/AddressTileMap'
import type { AddressRoutePreview } from '@/objects/view/address/AddressDetailsObjects'

export function AddressRoutePreviewMap({ preview }: { preview: AddressRoutePreview }) {
  const showRouteCurve = preview.showRouteCurve ?? Boolean(preview.endAddress && preview.endLabel)
  const showSecondaryMarker =
    preview.showDestinationMarker ?? Boolean(preview.endAddress && preview.endLabel)

  return (
    <section className={`address-route-preview${preview.weatherTone === 'rainy' ? ' is-rainy' : ''}${preview.compact ? ' is-compact' : ''}`}>
      {preview.compact ? null : (
        <>
          <div className="address-route-preview__header">
            <div>
              <p className="ticket-kind">配送路线</p>
              <h3>{preview.statusLabel}</h3>
            </div>
            {preview.etaLabel ? <span className="badge">{preview.etaLabel}</span> : null}
          </div>
          <div className="address-route-preview__summary">
            <p>
              {preview.startLabel}：{preview.startAddress}
            </p>
            {preview.endLabel && preview.endAddress ? (
              <p>
                {preview.endLabel}：{preview.endAddress}
              </p>
            ) : null}
            <p>当前状态：{preview.statusLabel}</p>
          </div>
        </>
      )}
      <AddressTileMap
        primaryLabel={preview.startLabel}
        primaryAddress={preview.startAddress}
        primaryCoordinate={preview.startCoordinate}
        primaryQuery={preview.startQuery}
        secondaryLabel={preview.endLabel}
        secondaryAddress={preview.endAddress}
        secondaryCoordinate={preview.endCoordinate}
        secondaryQuery={preview.endQuery}
        etaLabel={preview.etaLabel}
        compact={preview.compact}
        showRouteCurve={showRouteCurve}
        showSecondaryMarker={showSecondaryMarker}
        weatherTone={preview.weatherTone}
      />
    </section>
  )
}
