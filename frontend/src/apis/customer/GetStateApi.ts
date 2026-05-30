import { getStateApiDefinition } from '@/system/api/ApiRoutes'
import { getNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'

export function getState() {
  return getNormalizedDeliveryState(getStateApiDefinition)
}
