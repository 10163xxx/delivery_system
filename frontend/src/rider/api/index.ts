import type {
  DeliveryAppState,
  RiderId,
  UpdateRiderProfileRequest,
  WithdrawRiderIncomeRequest,
} from '@/shared/object'
import { request } from '@/shared/api/http'
import { DELIVERY_API_ROUTE } from '@/shared/api/routes'

export function updateRiderProfile(riderId: RiderId, payload: UpdateRiderProfileRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.riderProfile(riderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function withdrawRiderIncome(riderId: RiderId, payload: WithdrawRiderIncomeRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.riderWithdraw(riderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
