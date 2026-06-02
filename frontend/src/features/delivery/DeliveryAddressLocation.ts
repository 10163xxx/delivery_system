import { useEffect, useState } from 'react'
import { geocodeDeliveryAddress } from '@/features/delivery/DeliveryGeocoding'

export function useDeliveryAddressLocation(address: string) {
  const [isLocating, setIsLocating] = useState(false)
  const [isLocated, setIsLocated] = useState(false)

  useEffect(() => {
    const query = address.trim()
    const controller = new AbortController()
    if (!query) {
      setIsLocating(false)
      setIsLocated(false)
      return () => controller.abort()
    }

    setIsLocating(true)
    void geocodeDeliveryAddress(query, controller.signal)
      .then((coordinate) => {
        if (!controller.signal.aborted) setIsLocated(Boolean(coordinate))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLocating(false)
      })

    return () => controller.abort()
  }, [address])

  return { isLocated, isLocating }
}
