import { useEffect, useState } from 'react'
import { geocodeDeliveryAddress } from '@/pages/DeliveryConsole/functions/map/DeliveryGeocoding'
import { sameCoordinate } from '@/pages/DeliveryConsole/components/address/AddressTileMapGeometry'
import type { DeliveryCoordinate } from '@/objects/system/valueTypes/DeliveryCoordinate'
import type { AddressTileMapCoordinateParams } from '@/pages/DeliveryConsole/components/address/AddressTileMapTypes'

export function useAddressTileMapCoordinates(params: AddressTileMapCoordinateParams) {
  const {
    primaryCoordinate: primaryCoordinateProp,
    primaryQueryValue,
    secondaryCoordinate: secondaryCoordinateProp,
    secondaryQueryValue,
    showSecondaryMarker,
  } = params
  const [primaryCoordinate, setPrimaryCoordinate] = useState<DeliveryCoordinate | null>(primaryCoordinateProp ?? null)
  const [secondaryCoordinate, setSecondaryCoordinate] = useState<DeliveryCoordinate | null>(secondaryCoordinateProp ?? null)
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const locatingTimer = window.setTimeout(() => {
      if (!controller.signal.aborted) setIsLocating(true)
    }, 0)

    Promise.all([
      primaryCoordinateProp
        ? Promise.resolve(primaryCoordinateProp)
        : geocodeDeliveryAddress(primaryQueryValue, controller.signal),
      secondaryCoordinateProp
        ? Promise.resolve(secondaryCoordinateProp)
        : showSecondaryMarker && secondaryQueryValue
          ? geocodeDeliveryAddress(secondaryQueryValue, controller.signal)
          : Promise.resolve(null),
    ])
      .then(([nextPrimaryCoordinate, nextSecondaryCoordinate]) => {
        if (controller.signal.aborted) return
        setPrimaryCoordinate((current) =>
          sameCoordinate(current, nextPrimaryCoordinate) ? current : nextPrimaryCoordinate,
        )
        setSecondaryCoordinate((current) =>
          sameCoordinate(current, nextSecondaryCoordinate) ? current : nextSecondaryCoordinate,
        )
      })
      .finally(() => {
        window.clearTimeout(locatingTimer)
        if (!controller.signal.aborted) setIsLocating(false)
      })

    return () => {
      window.clearTimeout(locatingTimer)
      controller.abort()
    }
  }, [
    primaryCoordinateProp,
    primaryQueryValue,
    secondaryCoordinateProp,
    secondaryQueryValue,
    showSecondaryMarker,
  ])

  return {
    isLocating,
    primaryCoordinate,
    secondaryCoordinate,
  }
}
