import { useMemo, useRef } from 'react'

import { getCoordinateQuery } from '@/pages/DeliveryConsole/components/address/AddressTileMapGeometry'
import { useAddressTileMapCoordinates } from '@/pages/DeliveryConsole/components/address/AddressTileMapCoordinates'
import { useLeafletAddressMap } from '@/pages/DeliveryConsole/components/address/AddressTileMapLeaflet'
import { AddressTileMapStatus } from '@/pages/DeliveryConsole/components/address/AddressTileMapStatus'
import type { AddressTileMapProps } from '@/pages/DeliveryConsole/components/address/AddressTileMapTypes'

export type { AddressTileMapProps } from '@/pages/DeliveryConsole/components/address/AddressTileMapTypes'

export function AddressTileMap({
  primaryLabel,
  primaryAddress,
  primaryCoordinate: primaryCoordinateProp,
  primaryQuery,
  secondaryLabel,
  secondaryAddress,
  secondaryCoordinate: secondaryCoordinateProp,
  secondaryQuery,
  etaStageLabel,
  etaLabel,
  compact,
  showRouteCurve,
  showSecondaryMarker,
  weatherTone,
}: AddressTileMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const primaryQueryValue = useMemo(
    () => getCoordinateQuery(primaryAddress, primaryQuery ?? primaryLabel),
    [primaryAddress, primaryLabel, primaryQuery],
  )
  const secondaryQueryValue = useMemo(
    () => getCoordinateQuery(secondaryAddress, secondaryQuery ?? secondaryLabel),
    [secondaryAddress, secondaryLabel, secondaryQuery],
  )
  const { isLocating, primaryCoordinate, secondaryCoordinate } = useAddressTileMapCoordinates({
    primaryCoordinate: primaryCoordinateProp,
    primaryQueryValue,
    secondaryCoordinate: secondaryCoordinateProp,
    secondaryQueryValue,
    showSecondaryMarker,
  })
  useLeafletAddressMap({
    compact,
    containerRef,
    etaLabel,
    etaStageLabel,
    primaryAddress,
    primaryCoordinate,
    primaryLabel,
    secondaryAddress,
    secondaryCoordinate,
    secondaryLabel,
    showRouteCurve,
    showSecondaryMarker,
    weatherTone,
  })

  return (
    <div className="address-tile-map-frame">
      {primaryCoordinate || secondaryCoordinate ? (
        <div
          ref={containerRef}
          className={`address-tile-map${weatherTone === 'rainy' ? ' is-rainy' : ''}${compact ? ' is-compact' : ''}`}
        />
      ) : (
        <div className={`address-tile-map address-tile-map__placeholder${compact ? ' is-compact' : ''}`} />
      )}
      <AddressTileMapStatus
        isLocating={isLocating}
        primaryCoordinate={primaryCoordinate}
        secondaryCoordinate={secondaryCoordinate}
        showSecondaryMarker={showSecondaryMarker}
      />
    </div>
  )
}
