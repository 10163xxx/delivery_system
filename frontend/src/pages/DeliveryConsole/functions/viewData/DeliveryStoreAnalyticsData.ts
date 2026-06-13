import type { OrderSummary, Store, StoreId } from '@/objects/core/SharedObjects'
import { ORDER_STATUS, REVIEW_STATUS } from '@/objects/core/SharedObjects'
import { getOrderReviewEligibilityTime } from '@/pages/DeliveryConsole/functions/review/DeliveryReview'
import { isStoreCurrentlyOpen } from '@/pages/DeliveryConsole/functions/schedule/DeliverySchedule'
import { MILLISECONDS_PER_DAY, MONTHLY_TREND_WINDOW_DAYS, ZERO_COUNT } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'

const THIRTY_DAY_MILLISECONDS = MONTHLY_TREND_WINDOW_DAYS * MILLISECONDS_PER_DAY
const DAY_MILLISECONDS = MILLISECONDS_PER_DAY
const WEEK_MILLISECONDS = 7 * MILLISECONDS_PER_DAY

const POSITIVE_REVIEW_RATING_MIN = 5
const POSITIVE_REVIEW_DISPLAY_MIN = 20
const YESTERDAY_ORDER_DISPLAY_MIN = 10
const WEEKLY_ORDER_DISPLAY_MIN = 50
const RECENT_FREQUENT_STORE_DISPLAY_LIMIT = 4
const RECENT_FREQUENT_STORE_TOP_ITEM_LIMIT = 3

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

export function getStoreCustomerReviews(orders: OrderSummary[]) {
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

export function getStoreBrowseHighlights(orders: OrderSummary[]) {
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

export function getRecentFrequentStores(orders: OrderSummary[], stores: Store[]) {
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
        storeId: storeId as StoreId,
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
    .slice(ZERO_COUNT, RECENT_FREQUENT_STORE_DISPLAY_LIMIT)
}

function mergeTopItems(currentTopItems: string[], order: OrderSummary) {
  const orderedItemNames = order.items
    .slice()
    .sort((left, right) => right.quantity - left.quantity)
    .map((item) => item.name)

  return [...currentTopItems, ...orderedItemNames]
    .filter((itemName, index, itemNames) => itemNames.indexOf(itemName) === index)
    .slice(
    ZERO_COUNT,
    RECENT_FREQUENT_STORE_TOP_ITEM_LIMIT,
  )
}

function startOfDayTime(time: number) {
  const date = new Date(time)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}
