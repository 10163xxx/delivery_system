import type { OrderSummary, Store } from '@/objects/core/SharedObjects'
import { ORDER_STATUS } from '@/objects/core/SharedObjects'
import { MERCHANT_REVENUE_SHARE_DENOMINATOR, MERCHANT_REVENUE_SHARE_NUMERATOR, MILLISECONDS_PER_DAY, MONTHLY_TREND_WINDOW_DAYS } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'

const DAY_MILLISECONDS = MILLISECONDS_PER_DAY
const TREND_WINDOW_OFFSET_DAYS = MONTHLY_TREND_WINDOW_DAYS - 1

function formatTrendDateLabel(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function buildMerchantMonthlyTrend(merchantStores: Store[], orders: OrderSummary[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const firstDayTime = today.getTime() - TREND_WINDOW_OFFSET_DAYS * DAY_MILLISECONDS
  const merchantStoreIds = merchantStores.map((store) => store.id)
  const trend = Array.from({ length: MONTHLY_TREND_WINDOW_DAYS }, (_, index) => {
    const dayStart = new Date(firstDayTime + index * DAY_MILLISECONDS)
    return {
      dateLabel: formatTrendDateLabel(dayStart),
      orderCount: 0,
      incomeCents: 0,
    }
  })

  orders.forEach((order) => {
    if (!merchantStoreIds.includes(order.storeId)) return
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
