import { getStateApiDefinition } from '@/system/api/ApiRoutes'
import { getNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'

export function getState() {
  return getNormalizedDeliveryState(getStateApiDefinition)
}
