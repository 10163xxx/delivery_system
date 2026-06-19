// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
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
import type { SystemMetrics } from '@/objects/system/app/SystemMetrics'

export type DeliveryOrderState = {
  orders: OrderSummary[]
  tickets: AdminTicket[]
  metrics: SystemMetrics
}

export type DeliveryAppState = {
  customers: Customer[]
  merchantProfiles: MerchantProfile[]
  riders: Rider[]
  admins: AdminProfile[]
  stores: Store[]
  merchantApplications: MerchantApplication[]
  reviewAppeals: ReviewAppeal[]
  eligibilityReviews: EligibilityReview[]
  deliveryState: DeliveryOrderState
} & DeliveryOrderState
