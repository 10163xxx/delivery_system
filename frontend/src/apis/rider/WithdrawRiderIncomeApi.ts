// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, RiderId, WithdrawRiderIncomeRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const withdrawRiderIncomeApiDefinition = defineJsonPostApi1<RiderId, WithdrawRiderIncomeRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('riders')],
    [routeSegment('withdraw')],
  )

export function withdrawRiderIncome(
  riderId: RiderId,
  payload: WithdrawRiderIncomeRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(withdrawRiderIncomeApiDefinition, riderId), payload)
}
