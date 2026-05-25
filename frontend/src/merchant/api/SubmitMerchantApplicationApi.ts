import type { MerchantRegistrationRequest } from '@/shared/object/core/SharedObjects'
import { submitMerchantApplicationApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'

export function submitMerchantApplication(payload: MerchantRegistrationRequest) {
  return postNormalizedDeliveryState(submitMerchantApplicationApiDefinition, payload)
}
