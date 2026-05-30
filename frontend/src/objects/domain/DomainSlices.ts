import type { AdminTicket } from '@/objects/admin/afterSales/AdminTicket'
import type { AdminProfile } from '@/objects/admin/profile/AdminProfile'
import type { Customer } from '@/objects/customer/profile/Customer'
import type { MerchantApplication } from '@/objects/merchant/application/MerchantApplication'
import type { MerchantProfile } from '@/objects/merchant/profile/MerchantProfile'
import type { Store } from '@/objects/merchant/store/Store'
import type { OrderSummary } from '@/objects/order/core/OrderSummary'
import type { EligibilityReview } from '@/objects/review/EligibilityReview'
import type { ReviewAppeal } from '@/objects/review/ReviewAppeal'
import type { Rider } from '@/objects/rider/profile/Rider'
import type { SystemMetrics } from '@/objects/domain/SystemMetrics'

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
