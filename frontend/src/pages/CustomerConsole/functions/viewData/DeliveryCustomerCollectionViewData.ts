import type {
  Customer,
  CustomerId,
  DeliveryAppState,
  OrderId,
  OrderSummary,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import { ORDER_STATUS } from '@/objects/core/SharedObjects'
import { CUSTOMER_FAVORITE_STORE_CATEGORY } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { canReviewOrder } from '@/pages/DeliveryConsole/functions/review/DeliveryReview'
import { getStoreDeliveryQuote } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import type { DeliveryPageDerivedState } from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import { getResolvedAfterSalesNoticeIds } from '@/pages/DeliveryConsole/functions/viewData/DeliveryAnalyticsViewData'

const CUSTOMER_PROFILE_PENDING_ADDRESS = '请先完善默认地址'

export function getCustomerOrderCollections(
  state: DeliveryPageDerivedState,
  activeCustomerId: CustomerId | '',
  routeOrderId?: OrderId,
) {
  const customerOrders =
    state?.orders.filter((order: OrderSummary) => order.customerId === activeCustomerId) ?? []
  const completedCustomerOrders = customerOrders.filter(
    (order: OrderSummary) => order.status === ORDER_STATUS.completed,
  )
  const pendingCustomerReviewOrders = completedCustomerOrders.filter((order: OrderSummary) =>
    canReviewOrder(order),
  )
  const activeOrder =
    customerOrders.find((order: OrderSummary) => order.id === routeOrderId) ?? null

  return {
    customerOrders,
    completedCustomerOrders,
    pendingCustomerReviewOrders,
    activeCustomerOrder: activeOrder,
    activeReviewOrder: activeOrder,
  }
}

export function getCustomerNoticeCollections(
  selectedCustomer: Customer | undefined,
  customerOrders: OrderSummary[],
  completedCustomerOrders: OrderSummary[],
  tickets: DeliveryAppState['tickets'],
) {
  const customerProfileNoticeIds = [
    ...(isNewlyRegisteredCustomer(selectedCustomer) && selectedCustomer
      ? [`registration:${selectedCustomer.id}`]
      : []),
    ...customerOrders.filter(isAcceptedCustomerOrder).map(getAcceptedCustomerOrderNoticeId),
    ...completedCustomerOrders.map(getCompletedCustomerOrderNoticeId),
    ...getResolvedAfterSalesNoticeIds(customerOrders, tickets),
  ]

  return {
    customerProfileNoticeIds,
    customerProfileNoticeCount: customerProfileNoticeIds.length,
    customerRequiresDefaultAddressUpdate: isNewlyRegisteredCustomer(selectedCustomer),
  }
}

export function getCustomerStoreCollections(
  state: DeliveryPageDerivedState,
  selectedCustomer: Customer | undefined,
  customerStoreSearch: string,
  selectedStoreCategory: string,
  favoriteStoreIds: StoreId[],
  blockedStoreIds: StoreId[],
) {
  const normalizedCustomerStoreSearch = customerStoreSearch.trim().toLowerCase()
  const referenceLocation = selectedCustomer?.location
  const allBrowsableStores =
    state?.stores.filter((store: Store) => !blockedStoreIds.includes(store.id)).slice() ?? []
  const sortStoresByDistance = (stores: Store[]) =>
    stores
      .slice()
      .sort(
        (left: Store, right: Store) =>
          getStoreDeliveryQuote(left, referenceLocation).distanceKm - getStoreDeliveryQuote(right, referenceLocation).distanceKm ||
          right.averageRating - left.averageRating ||
          right.ratingCount - left.ratingCount,
      )
  const favoriteStores = sortStoresByDistance(
    allBrowsableStores.filter((store: Store) => favoriteStoreIds.includes(store.id)),
  )
  const visibleStores =
    sortStoresByDistance(
      allBrowsableStores.filter((store: Store) =>
        normalizedCustomerStoreSearch
          ? store.name.toLowerCase().includes(normalizedCustomerStoreSearch) ||
            store.merchantName.toLowerCase().includes(normalizedCustomerStoreSearch)
          : true,
      ),
    )
  const categoryStores =
    selectedStoreCategory === CUSTOMER_FAVORITE_STORE_CATEGORY
      ? favoriteStores
      : visibleStores.filter((store: Store) => store.category === selectedStoreCategory)
  const blockedStores =
    state?.stores.filter((store: Store) => blockedStoreIds.includes(store.id)).slice() ?? []

  return {
    favoriteStores,
    blockedStores,
    visibleStores,
    categoryStores,
  }
}

function isNewlyRegisteredCustomer(customer: Customer | undefined) {
  if (!customer) return false

  return (
    customer.defaultAddress === CUSTOMER_PROFILE_PENDING_ADDRESS &&
    customer.addresses.length === 1 &&
    customer.addresses[0]?.address === CUSTOMER_PROFILE_PENDING_ADDRESS
  )
}

function isAcceptedCustomerOrder(order: OrderSummary) {
  return (
    order.status === ORDER_STATUS.preparing ||
    order.status === ORDER_STATUS.readyForPickup ||
    order.status === ORDER_STATUS.delivering
  )
}

function getAcceptedCustomerOrderNoticeId(order: OrderSummary) {
  const acceptedTimelineEntry =
    order.timeline.find((entry) => entry.status === ORDER_STATUS.preparing) ?? order.timeline[0]

  return `accepted:${order.id}:${acceptedTimelineEntry?.at ?? order.updatedAt}`
}

function getCompletedCustomerOrderNoticeId(order: OrderSummary) {
  const completedTimelineEntry =
    order.timeline.find((entry) => entry.status === ORDER_STATUS.completed) ?? order.timeline[order.timeline.length - 1]

  return `completed:${order.id}:${completedTimelineEntry?.at ?? order.updatedAt}`
}
