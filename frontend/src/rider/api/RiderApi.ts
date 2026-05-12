import type {
  DeliveryAppState,
  RiderId,
  UpdateRiderProfileRequest,
  WithdrawRiderIncomeRequest,
} from '@/shared/object/core/SharedObjects'
import {
  defineJsonPostEndpoint,
  httpClient,
} from '@/shared/api/SharedHttpClient'
import { normalizeDeliveryState } from '@/shared/api/DeliveryStateNormalizer'
import {
  getRiderProfileApiRoute,
  getRiderWithdrawApiRoute,
} from '@/shared/api/ApiRoutes'

export const riderApi = {
  updateRiderProfile(riderId: RiderId, payload: UpdateRiderProfileRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<UpdateRiderProfileRequest, DeliveryAppState>(
        getRiderProfileApiRoute(riderId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  withdrawRiderIncome(riderId: RiderId, payload: WithdrawRiderIncomeRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<WithdrawRiderIncomeRequest, DeliveryAppState>(
        getRiderWithdrawApiRoute(riderId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
}

export const { updateRiderProfile, withdrawRiderIncome } = riderApi
