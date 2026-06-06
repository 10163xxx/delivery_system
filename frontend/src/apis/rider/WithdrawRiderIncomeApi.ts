import type {
  RiderId,
  WithdrawRiderIncomeRequest,
} from '@/objects/core/SharedObjects'
import { withdrawRiderIncomeApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function withdrawRiderIncome(
  riderId: RiderId,
  payload: WithdrawRiderIncomeRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(withdrawRiderIncomeApiDefinition, riderId), payload)
}
