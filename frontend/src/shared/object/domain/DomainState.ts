import type { AdminProfile, SystemMetrics } from '@/admin/object/AdminObjects'
import type { Customer } from '@/customer/object/CustomerObjects'
import type { MerchantApplication, MerchantProfile, Store } from '@/merchant/object/MerchantObjects'
import type { OrderSummary } from '@/order/object/OrderObjects'
import type { EligibilityReview, ReviewAppeal, AdminTicket } from '@/review/object/ReviewObjects'
import type { Rider } from '@/rider/object/RiderObjects'

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
