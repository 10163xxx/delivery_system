import { STORE_STATUS, type OrderSummary, type Store } from '@/objects/core/SharedObjects'
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type {
  CustomerOrderSection,
  CustomerOrderSectionData,
} from '@/pages/CustomerConsole/objects/CustomerOrderObjects'
import { CUSTOMER_ORDER_SECTION as CUSTOMER_ORDER_SECTIONS } from '@/pages/CustomerConsole/objects/CustomerOrderObjects'
import {
  ACTIVE_CUSTOMER_ORDER_STATUSES,
  ZERO_COUNT,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import {
  CUSTOMER_ORDER_WORKSPACE_COPY,
  formatNoReviewOrdersMessage,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'

export type RepeatOrderAvailability =
  | { readonly canRepeat: true }
  | { readonly canRepeat: false; readonly reason: string }

export function getCustomerOrderSectionData(args: {
  customerOrderSection: CustomerOrderSection
  customerOrders: OrderSummary[]
  activeCustomerOrders: OrderSummary[]
  pendingCustomerReviewOrders: OrderSummary[]
  REVIEW_WINDOW_DAYS: number
}): CustomerOrderSectionData | null {
  const {
    customerOrderSection,
    customerOrders,
    activeCustomerOrders,
    pendingCustomerReviewOrders,
    REVIEW_WINDOW_DAYS,
  } = args

  if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.active) {
    return {
      title: CUSTOMER_ORDER_WORKSPACE_COPY.activeSectionTitle,
      count: activeCustomerOrders.length,
      orders: activeCustomerOrders,
      emptyText: CUSTOMER_ORDER_WORKSPACE_COPY.noActiveOrders,
    }
  }

  if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.review) {
    return {
      title: CUSTOMER_ORDER_WORKSPACE_COPY.reviewSectionTitle,
      count: pendingCustomerReviewOrders.length,
      orders: pendingCustomerReviewOrders,
      emptyText: formatNoReviewOrdersMessage(REVIEW_WINDOW_DAYS),
    }
  }

  if (customerOrderSection === CUSTOMER_ORDER_SECTIONS.all) {
    return {
      title: CUSTOMER_ORDER_WORKSPACE_COPY.allSectionTitle,
      count: customerOrders.length,
      orders: customerOrders,
      emptyText: CUSTOMER_ORDER_WORKSPACE_COPY.noOrders,
    }
  }

  return null
}

export function getActiveCustomerOrders(customerOrders: OrderSummary[]) {
  return customerOrders.filter((order: OrderSummary) =>
    ACTIVE_CUSTOMER_ORDER_STATUSES.some((status) => status === order.status),
  )
}

export function getRepeatOrderAvailability(
  order: OrderSummary,
  stores: Store[],
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
): RepeatOrderAvailability {
  const store = stores.find((entry) => entry.id === order.storeId)

  if (!store) {
    return {
      canRepeat: false,
      reason: CUSTOMER_ORDER_WORKSPACE_COPY.repeatUnavailableStoreMissing,
    }
  }

  if (store.status === STORE_STATUS.revoked) {
    return {
      canRepeat: false,
      reason: CUSTOMER_ORDER_WORKSPACE_COPY.repeatUnavailableStoreRevoked,
    }
  }

  if (store.menu.length === ZERO_COUNT) {
    return {
      canRepeat: false,
      reason: CUSTOMER_ORDER_WORKSPACE_COPY.repeatUnavailableNoMenu,
    }
  }

  if (!isStoreCurrentlyOpen(store)) {
    return {
      canRepeat: false,
      reason: CUSTOMER_ORDER_WORKSPACE_COPY.repeatUnavailableStoreClosed,
    }
  }

  return { canRepeat: true }
}
