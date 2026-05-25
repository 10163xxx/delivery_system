import type {
  RiderId,
  WithdrawRiderIncomeRequest,
} from '@/shared/object/core/SharedObjects'
import { withdrawRiderIncomeApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function withdrawRiderIncome(
  riderId: RiderId,
  payload: WithdrawRiderIncomeRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(withdrawRiderIncomeApiDefinition, riderId), payload)
}
