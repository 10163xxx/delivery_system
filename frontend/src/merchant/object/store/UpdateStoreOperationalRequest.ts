import type { BusinessHours } from '@/merchant/object/store/BusinessHours'
import type { Minutes } from '@/shared/object/domain/DomainObjects'

export type UpdateStoreOperationalRequest = {
  businessHours: BusinessHours
  avgPrepMinutes: Minutes
}
