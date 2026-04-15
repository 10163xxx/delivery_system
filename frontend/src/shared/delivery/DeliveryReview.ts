import { ORDER_STATUS, type OrderSummary } from '@/shared/object/SharedObjects'
import {
  MAX_RATING,
  MILLISECONDS_PER_DAY,
  REVIEW_WINDOW_DAYS,
} from './DeliveryConstants'

export function formatAggregateRating(average: number, count: number) {
  return count > 0 ? `${average.toFixed(1)} / ${MAX_RATING} (${count} 条)` : '暂无评分'
}

export function isOrderReviewed(order: OrderSummary) {
  return order.storeRating != null && (order.riderId ? order.riderRating != null : true)
}

export function hasPendingStoreReview(order: OrderSummary) {
  return order.storeRating == null
}

export function hasPendingRiderReview(order: OrderSummary) {
  return order.riderId != null && order.riderRating == null
}

export function getOrderReviewEligibilityTime(order: OrderSummary) {
  return [...order.timeline]
    .reverse()
    .find((entry) => entry.status === ORDER_STATUS.completed)?.at ?? order.updatedAt
}

export function canReviewOrder(order: OrderSummary, currentTime = Date.now()) {
  if (order.status !== ORDER_STATUS.completed || isOrderReviewed(order)) return false
  const reviewDeadline = new Date(getOrderReviewEligibilityTime(order)).getTime()
  const reviewWindowMs = REVIEW_WINDOW_DAYS * MILLISECONDS_PER_DAY
  return Number.isFinite(reviewDeadline) && currentTime - reviewDeadline <= reviewWindowMs
}

export function getRemainingReviewDays(order: OrderSummary, currentTime = Date.now()) {
  const reviewStartTime = new Date(getOrderReviewEligibilityTime(order)).getTime()
  const reviewDeadline = reviewStartTime + REVIEW_WINDOW_DAYS * MILLISECONDS_PER_DAY
  if (!Number.isFinite(reviewStartTime)) return 0
  return Math.max(0, Math.ceil((reviewDeadline - currentTime) / MILLISECONDS_PER_DAY))
}
