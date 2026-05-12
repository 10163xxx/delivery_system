import type { DeliveryAppState, OrderSummary, Store } from '@/shared/object/core/SharedObjects'
import { ORDER_STATUS, REVIEW_STATUS, TICKET_KIND, TICKET_STATUS } from '@/shared/object/core/SharedObjects'
import {
  MERCHANT_REVENUE_SHARE_DENOMINATOR,
  MERCHANT_REVENUE_SHARE_NUMERATOR,
  MILLISECONDS_PER_DAY,
  MONTHLY_TREND_WINDOW_DAYS,
  getOrderReviewEligibilityTime,
  isStoreCurrentlyOpen,
} from '@/shared/delivery/DeliveryServices'

const THIRTY_DAY_MILLISECONDS = MONTHLY_TREND_WINDOW_DAYS * MILLISECONDS_PER_DAY
const DAY_MILLISECONDS = MILLISECONDS_PER_DAY
const TREND_WINDOW_OFFSET_DAYS = MONTHLY_TREND_WINDOW_DAYS - 1

function formatTrendDateLabel(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function getAnalyticsCollections(
  state: DeliveryAppState | null,
  merchantStores: Store[],
  selectedStore: Store | undefined,
) {
  const orders = state?.orders ?? []

  return {
    monthlySalesByMenuItem: getRecentCompletedMonthlySalesByMenuItem(orders),
    monthlyOrdersByStore: getRecentMonthlyOrdersByStore(orders),
    storeCustomerReviews: getStoreCustomerReviews(orders),
    merchantMonthlyTrend: buildMerchantMonthlyTrend(merchantStores, orders),
    selectedStoreIsOpen: selectedStore ? isStoreCurrentlyOpen(selectedStore) : false,
  }
}

export function getResolvedAfterSalesNoticeIds(
  customerOrders: OrderSummary[],
  tickets: DeliveryAppState['tickets'],
) {
  const customerOrderIds = new Set(customerOrders.map((order) => order.id))

  return tickets
    .filter(
      (ticket) =>
        customerOrderIds.has(ticket.orderId) &&
        ticket.kind === TICKET_KIND.deliveryIssue &&
        ticket.status === TICKET_STATUS.resolved,
    )
    .map((ticket) => `after-sales:${ticket.id}:${ticket.updatedAt}`)
}

function getRecentCompletedMonthlySalesByMenuItem(orders: OrderSummary[]) {
  const threshold = Date.now() - THIRTY_DAY_MILLISECONDS

  return orders.reduce(
    (salesByMenuItem, order) => {
      if (order.status !== ORDER_STATUS.completed) return salesByMenuItem
      if (new Date(order.updatedAt).getTime() < threshold) return salesByMenuItem

      order.items.forEach((item) => {
        salesByMenuItem[item.menuItemId] = (salesByMenuItem[item.menuItemId] ?? 0) + item.quantity
      })

      return salesByMenuItem
    },
    {} as Record<string, number>,
  )
}

function getRecentMonthlyOrdersByStore(orders: OrderSummary[]) {
  const threshold = Date.now() - THIRTY_DAY_MILLISECONDS

  return orders.reduce(
    (ordersByStore, order) => {
      if (new Date(order.createdAt).getTime() < threshold) return ordersByStore
      ordersByStore[order.storeId] = (ordersByStore[order.storeId] ?? 0) + 1
      return ordersByStore
    },
    {} as Record<string, number>,
  )
}

function buildMerchantMonthlyTrend(merchantStores: Store[], orders: OrderSummary[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const firstDayTime = today.getTime() - TREND_WINDOW_OFFSET_DAYS * DAY_MILLISECONDS
  const merchantStoreIds = new Set(merchantStores.map((store) => store.id))
  const trend = Array.from({ length: MONTHLY_TREND_WINDOW_DAYS }, (_, index) => {
    const dayStart = new Date(firstDayTime + index * DAY_MILLISECONDS)
    return {
      dateLabel: formatTrendDateLabel(dayStart),
      orderCount: 0,
      incomeCents: 0,
    }
  })

  orders.forEach((order) => {
    if (!merchantStoreIds.has(order.storeId)) return
    const orderTime = new Date(order.createdAt).getTime()
    if (orderTime < firstDayTime || orderTime >= firstDayTime + MONTHLY_TREND_WINDOW_DAYS * DAY_MILLISECONDS) return

    const bucket = trend[Math.floor((orderTime - firstDayTime) / DAY_MILLISECONDS)]
    if (!bucket) return

    bucket.orderCount += 1
    if (order.status === ORDER_STATUS.completed) {
      bucket.incomeCents +=
        (order.itemSubtotalCents * MERCHANT_REVENUE_SHARE_NUMERATOR) /
        MERCHANT_REVENUE_SHARE_DENOMINATOR
    }
  })

  return trend
}

function getStoreCustomerReviews(orders: OrderSummary[]) {
  return orders
    .flatMap((order) => {
      if (
        order.status !== ORDER_STATUS.completed ||
        order.reviewStatus !== REVIEW_STATUS.active ||
        order.storeRating == null
      ) {
        return []
      }

      return [
        {
          id: order.id,
          storeId: order.storeId,
          customerName: order.customerName,
          rating: order.storeRating,
          comment: order.storeReviewComment,
          extraNote: order.storeReviewExtraNote,
          completedAt: getOrderReviewEligibilityTime(order),
        },
      ]
    })
    .sort(
      (left, right) =>
        new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime(),
    )
    .reduce(
      (reviewsByStore, review) => {
        const reviews = reviewsByStore[review.storeId] ?? []
        reviewsByStore[review.storeId] = [
          ...reviews,
          {
            id: review.id,
            customerName: review.customerName,
            rating: review.rating,
            comment: review.comment,
            extraNote: review.extraNote,
            completedAt: review.completedAt,
          },
        ]
        return reviewsByStore
      },
      {} as Record<
        string,
        Array<{
          id: string
          customerName: string
          rating: number
          comment?: string
          extraNote?: string
          completedAt: string
        }>
      >,
    )
}
