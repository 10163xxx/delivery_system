import { getStateApiDefinition } from '@/shared/api/ApiRoutes'
import { getNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'

export function getState() {
  return getNormalizedDeliveryState(getStateApiDefinition)
}
