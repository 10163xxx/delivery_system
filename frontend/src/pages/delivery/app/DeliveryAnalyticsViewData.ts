import type {
  DeliveryAppState,
  EntityCount,
  MenuItemId,
  OrderSummary,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import { ORDER_STATUS, TICKET_KIND, TICKET_STATUS } from '@/objects/core/SharedObjects'
import {
  MONTHLY_TREND_WINDOW_DAYS,
  isStoreCurrentlyOpen,
  MILLISECONDS_PER_DAY,
} from '@/features/delivery/DeliveryServices'
import { asDomainNumber } from '@/features/delivery/DeliveryShared'
import { buildMerchantMonthlyTrend } from '@/pages/delivery/app/DeliveryMerchantTrendData'
import {
  getRecentFrequentStores,
  getStoreBrowseHighlights,
  getStoreCustomerReviews,
} from '@/pages/delivery/app/DeliveryStoreAnalyticsData'

const THIRTY_DAY_MILLISECONDS = MONTHLY_TREND_WINDOW_DAYS * MILLISECONDS_PER_DAY
export type { RecentFrequentStoreEntry } from '@/pages/delivery/app/DeliveryStoreAnalyticsData'

export function getAnalyticsCollections(
  state: DeliveryAppState | null,
  merchantStores: Store[],
  selectedStore: Store | undefined,
  personalOrders?: OrderSummary[],
) {
  const orders = state?.orders ?? []
  const stores = state?.stores ?? []
  const recentFrequentSourceOrders = personalOrders ?? orders

  return {
    monthlySalesByMenuItem: getRecentCompletedMonthlySalesByMenuItem(orders),
    monthlyOrdersByStore: getRecentMonthlyOrdersByStore(orders),
    recentFrequentStores: getRecentFrequentStores(recentFrequentSourceOrders, stores),
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
        salesByMenuItem[item.menuItemId] = asDomainNumber<EntityCount>(
          (salesByMenuItem[item.menuItemId] ?? 0) + item.quantity,
        )
      })

      return salesByMenuItem
    },
    {} as Record<MenuItemId, EntityCount>,
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
    {} as Record<StoreId, number>,
  )
}
