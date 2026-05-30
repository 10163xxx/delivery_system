import type { DeliveryAppState, OrderSummary, Store } from '@/objects/core/SharedObjects'
import { ORDER_STATUS, REVIEW_STATUS, TICKET_KIND, TICKET_STATUS } from '@/objects/core/SharedObjects'
import {
  MERCHANT_REVENUE_SHARE_DENOMINATOR,
  MERCHANT_REVENUE_SHARE_NUMERATOR,
  MILLISECONDS_PER_DAY,
  MONTHLY_TREND_WINDOW_DAYS,
  getOrderReviewEligibilityTime,
  isStoreCurrentlyOpen,
} from '@/features/delivery/DeliveryServices'

const THIRTY_DAY_MILLISECONDS = MONTHLY_TREND_WINDOW_DAYS * MILLISECONDS_PER_DAY
const DAY_MILLISECONDS = MILLISECONDS_PER_DAY
const TREND_WINDOW_OFFSET_DAYS = MONTHLY_TREND_WINDOW_DAYS - 1
const WEEK_MILLISECONDS = 7 * MILLISECONDS_PER_DAY

const POSITIVE_REVIEW_RATING_MIN = 5
const POSITIVE_REVIEW_DISPLAY_MIN = 20
const YESTERDAY_ORDER_DISPLAY_MIN = 10
const WEEKLY_ORDER_DISPLAY_MIN = 50

export type RecentFrequentStoreEntry = {
  storeId: Store['id']
  storeName: Store['name']
  category: Store['category']
  imageUrl: Store['imageUrl']
  canOrder: boolean
  orderCount: number
  lastOrderedAt: string
  topItems: string[]
  latestOrder: OrderSummary
}

type RecentFrequentStoreStats = {
  orderCount: number
  lastOrderedAt: string
  latestOrder: OrderSummary
  topItems: string[]
}

function formatTrendDateLabel(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function getAnalyticsCollections(
  state: DeliveryAppState | null,
  merchantStores: Store[],
  selectedStore: Store | undefined,
) {
  const orders = state?.orders ?? []
  const stores = state?.stores ?? []

  return {
    monthlySalesByMenuItem: getRecentCompletedMonthlySalesByMenuItem(orders),
    monthlyOrdersByStore: getRecentMonthlyOrdersByStore(orders),
    recentFrequentStores: getRecentFrequentStores(orders, stores),
    storeCustomerReviews: getStoreCustomerReviews(orders),
    storeBrowseHighlights: getStoreBrowseHighlights(orders),
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
    .map((ticket) => `afterSales:${ticket.id}:${ticket.updatedAt}`)
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
          merchantReply: order.storeMerchantReply,
          merchantReplyAt: order.storeMerchantReplyAt,
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
            merchantReply: review.merchantReply,
            merchantReplyAt: review.merchantReplyAt,
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
          merchantReply?: string
          merchantReplyAt?: string
          completedAt: string
        }>
      >,
    )
}

function getStoreBrowseHighlights(orders: OrderSummary[]) {
  const now = Date.now()
  const yesterdayStart = startOfDayTime(now - DAY_MILLISECONDS)
  const todayStart = startOfDayTime(now)
  const weeklyThreshold = now - WEEK_MILLISECONDS
  const monthlyThreshold = now - THIRTY_DAY_MILLISECONDS

  const statsByStore = orders.reduce(
    (current, order) => {
      const stats = current[order.storeId] ?? {
        monthlyPositiveReviewCount: 0,
        yesterdayOrderCount: 0,
        weeklyOrderCount: 0,
      }
      const createdAtTime = new Date(order.createdAt).getTime()

      if (createdAtTime >= yesterdayStart && createdAtTime < todayStart) {
        stats.yesterdayOrderCount += 1
      }
      if (createdAtTime >= weeklyThreshold) {
        stats.weeklyOrderCount += 1
      }
      if (
        order.status === ORDER_STATUS.completed &&
        order.reviewStatus === REVIEW_STATUS.active &&
        order.storeRating != null &&
        order.storeRating >= POSITIVE_REVIEW_RATING_MIN &&
        new Date(order.updatedAt).getTime() >= monthlyThreshold
      ) {
        stats.monthlyPositiveReviewCount += 1
      }

      current[order.storeId] = stats
      return current
    },
    {} as Record<
      string,
      {
        monthlyPositiveReviewCount: number
        yesterdayOrderCount: number
        weeklyOrderCount: number
      }
    >,
  )

  return Object.fromEntries(
    Object.entries(statsByStore).map(([storeId, stats]) => [
      storeId,
      buildStoreBrowseHighlights(stats),
    ]),
  )
}

function buildStoreBrowseHighlights(stats: {
  monthlyPositiveReviewCount: number
  yesterdayOrderCount: number
  weeklyOrderCount: number
}) {
  if (stats.monthlyPositiveReviewCount >= POSITIVE_REVIEW_DISPLAY_MIN) {
    return [`近期 ${stats.monthlyPositiveReviewCount} 条 5 星好评`]
  }
  if (stats.yesterdayOrderCount >= YESTERDAY_ORDER_DISPLAY_MIN) {
    return [`昨日 ${stats.yesterdayOrderCount} 单`]
  }
  if (stats.weeklyOrderCount >= WEEKLY_ORDER_DISPLAY_MIN) {
    return [`近 7 天 ${stats.weeklyOrderCount} 单`]
  }

  return []
}

function getRecentFrequentStores(orders: OrderSummary[], stores: Store[]) {
  const statsByStore = orders.reduce(
    (current, order) => {
      const existing = current[order.storeId]
      const nextTopItems = mergeTopItems(existing?.topItems ?? [], order)
      const nextLastOrderedAt =
        !existing || new Date(order.createdAt).getTime() > new Date(existing.lastOrderedAt).getTime()
          ? order.createdAt
          : existing.lastOrderedAt
      const nextLatestOrder =
        !existing || new Date(order.createdAt).getTime() > new Date(existing.latestOrder.createdAt).getTime()
          ? order
          : existing.latestOrder

      current[order.storeId] = {
        orderCount: (existing?.orderCount ?? 0) + 1,
        lastOrderedAt: nextLastOrderedAt,
        latestOrder: nextLatestOrder,
        topItems: nextTopItems,
      }
      return current
    },
    {} as Record<string, RecentFrequentStoreStats>,
  )

  return Object.entries(statsByStore)
    .map(([storeId, stats]): RecentFrequentStoreEntry | null => {
      const store = stores.find((entry) => entry.id === storeId)
      if (!store) return null

      return {
        storeId,
        storeName: store.name,
        category: store.category,
        imageUrl: store.imageUrl,
        canOrder: isStoreCurrentlyOpen(store) && store.menu.length > 0,
        orderCount: stats.orderCount,
        lastOrderedAt: stats.lastOrderedAt,
        topItems: stats.topItems,
        latestOrder: stats.latestOrder,
      }
    })
    .filter((entry): entry is RecentFrequentStoreEntry => entry !== null)
    .sort((left, right) => {
      const orderCountDiff = (right?.orderCount ?? 0) - (left?.orderCount ?? 0)
      if (orderCountDiff !== 0) return orderCountDiff
      return (
        new Date(right?.lastOrderedAt ?? 0).getTime() -
        new Date(left?.lastOrderedAt ?? 0).getTime()
      )
    })
    .slice(0, 4)
}

function mergeTopItems(currentTopItems: string[], order: OrderSummary) {
  const orderedItemNames = order.items
    .slice()
    .sort((left, right) => right.quantity - left.quantity)
    .map((item) => item.name)

  return Array.from(new Set([...currentTopItems, ...orderedItemNames])).slice(0, 3)
}

function startOfDayTime(time: number) {
  const date = new Date(time)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}
