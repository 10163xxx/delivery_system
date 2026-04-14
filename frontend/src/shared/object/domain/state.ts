import type { AdminProfile, SystemMetrics } from '@/admin/object'
import type { Customer } from '@/customer/object'
import type { MerchantApplication, MerchantProfile, Store } from '@/merchant/object'
import type { OrderSummary } from '@/order/object'
import type { EligibilityReview, ReviewAppeal, AdminTicket } from '@/review/object'
import type { Rider } from '@/rider/object'

export type DeliveryAppState = {
  customers: Customer[]
  stores: Store[]
  merchantProfiles: MerchantProfile[]
  riders: Rider[]
  admins: AdminProfile[]
  merchantApplications: MerchantApplication[]
  reviewAppeals: ReviewAppeal[]
  eligibilityReviews: EligibilityReview[]
  orders: OrderSummary[]
  tickets: AdminTicket[]
  metrics: SystemMetrics
}
