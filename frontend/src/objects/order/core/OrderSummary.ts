import type { OrderSummaryActivity } from '@/objects/order/core/OrderSummaryActivity'
import type { OrderSummaryFulfillment } from '@/objects/order/core/OrderSummaryFulfillment'
import type { OrderSummaryIdentity } from '@/objects/order/core/OrderSummaryIdentity'
import type { OrderSummaryLifecycle } from '@/objects/order/core/OrderSummaryLifecycle'
import type { OrderSummaryPricing } from '@/objects/order/core/OrderSummaryPricing'
import type { OrderSummaryReviewContent } from '@/objects/order/core/OrderSummaryReviewContent'
import type { OrderSummaryReviewState } from '@/objects/order/core/OrderSummaryReviewState'

export type {
  OrderSummaryActivity,
} from '@/objects/order/core/OrderSummaryActivity'
export type {
  OrderSummaryFulfillment,
} from '@/objects/order/core/OrderSummaryFulfillment'
export type {
  OrderSummaryIdentity,
} from '@/objects/order/core/OrderSummaryIdentity'
export type {
  OrderSummaryLifecycle,
} from '@/objects/order/core/OrderSummaryLifecycle'
export type {
  OrderSummaryPricing,
} from '@/objects/order/core/OrderSummaryPricing'
export type {
  OrderSummaryReviewContent,
} from '@/objects/order/core/OrderSummaryReviewContent'
export type {
  OrderSummaryReviewState,
} from '@/objects/order/core/OrderSummaryReviewState'

export type OrderSummary = {
  identity: OrderSummaryIdentity
  fulfillment: OrderSummaryFulfillment
  pricing: OrderSummaryPricing
  lifecycle: OrderSummaryLifecycle
  reviewState: OrderSummaryReviewState
  reviewContent: OrderSummaryReviewContent
  activity: OrderSummaryActivity
} & OrderSummaryIdentity &
  OrderSummaryFulfillment &
  OrderSummaryPricing &
  OrderSummaryLifecycle &
  OrderSummaryActivity &
  OrderSummaryReviewState &
  OrderSummaryReviewContent
