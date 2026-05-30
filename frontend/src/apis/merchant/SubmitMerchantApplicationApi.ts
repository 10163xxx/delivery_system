import type { MerchantRegistrationRequest } from '@/objects/core/SharedObjects'
import { submitMerchantApplicationApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'

export function submitMerchantApplication(payload: MerchantRegistrationRequest) {
  return postNormalizedDeliveryState(submitMerchantApplicationApiDefinition, payload)
}
