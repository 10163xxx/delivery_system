import type { AdminProfile, SystemMetrics } from '../admin'
import type { Customer } from '../customer'
import type { MerchantApplication, MerchantProfile, Store } from '../merchant'
import type { OrderSummary } from '../order'
import type { EligibilityReview, ReviewAppeal, AdminTicket } from '../review'
import type { Rider } from '../rider'

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
