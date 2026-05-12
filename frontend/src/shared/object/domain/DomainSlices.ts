import type { AdminTicket } from '@/admin/object/after-sales/AdminTicket'
import type { AdminProfile } from '@/admin/object/profile/AdminProfile'
import type { Customer } from '@/customer/object/profile/Customer'
import type { MerchantApplication } from '@/merchant/object/application/MerchantApplication'
import type { MerchantProfile } from '@/merchant/object/profile/MerchantProfile'
import type { Store } from '@/merchant/object/store/Store'
import type { OrderSummary } from '@/order/object/core/OrderSummary'
import type { EligibilityReview } from '@/review/object/EligibilityReview'
import type { ReviewAppeal } from '@/review/object/ReviewAppeal'
import type { Rider } from '@/rider/object/profile/Rider'
import type { SystemMetrics } from '@/shared/object/domain/SystemMetrics'

export type DeliveryOrderState = {
  orders: OrderSummary[]
  tickets: AdminTicket[]
  metrics: SystemMetrics
}

export type DeliveryAccountCollections = {
  customers: Customer[]
  merchantProfiles: MerchantProfile[]
  riders: Rider[]
  admins: AdminProfile[]
}

export type DeliveryCommerceCollections = {
  stores: Store[]
  merchantApplications: MerchantApplication[]
}

export type DeliveryGovernanceCollections = {
  reviewAppeals: ReviewAppeal[]
  eligibilityReviews: EligibilityReview[]
}
