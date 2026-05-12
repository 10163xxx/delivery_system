import type {
  Customer,
  DeliveryAppState,
  MerchantProfile,
  OrderSummary,
  Rider,
  Store,
} from '@/shared/object/core/SharedObjects'
import {
  APPLICATION_STATUS,
  ORDER_STATUS,
  ROLE,
  TICKET_KIND,
} from '@/shared/object/core/SharedObjects'
import { STORE_CATEGORIES, canReviewOrder } from '@/shared/delivery/DeliveryServices'
import type {
  DeliveryPageDerivedState,
  SessionState,
} from '@/shared/object/core/DeliveryPageObjects'
import {
  getAnalyticsCollections,
  getResolvedAfterSalesNoticeIds,
} from '@/shared/app/delivery/DeliveryAnalyticsViewData'

const CUSTOMER_PROFILE_PENDING_ADDRESS = '请先完善默认地址'

export function getActiveCustomerId(
  session: SessionState['session'],
  selectedCustomerId: string,
) {
  return session?.user.role === ROLE.customer && session.user.linkedProfileId
    ? session.user.linkedProfileId
    : selectedCustomerId
}

export function getSelectedEntities(input: {
  state: DeliveryPageDerivedState
  session: SessionState['session']
  activeCustomerId: string
  selectedStoreId: string
  selectedRiderId: string
}) {
  const { state, session, activeCustomerId, selectedStoreId, selectedRiderId } = input

  return {
    selectedStore: state?.stores.find((store) => store.id === selectedStoreId),
    selectedCustomer: state?.customers.find((customer) => customer.id === activeCustomerId),
    merchantProfile: state?.merchantProfiles.find(
      (profile: MerchantProfile) => profile.merchantName === session?.user.displayName,
    ),
    selectedRider: state?.riders.find((rider: Rider) => rider.id === selectedRiderId),
  }
}

export function getMerchantStores(
  state: DeliveryPageDerivedState,
  session: SessionState['session'],
) {
  return (
    state?.stores.filter((store: Store) =>
      session?.user.role === ROLE.merchant
        ? store.merchantName === session.user.displayName
        : true,
    ) ?? []
  )
}

export function getRiderOrders(
  state: DeliveryPageDerivedState,
  session: SessionState['session'],
  selectedRiderId: string,
) {
  return (
    state?.orders.filter((order: OrderSummary) =>
      session?.user.role === ROLE.rider
        ? order.status === ORDER_STATUS.readyForPickup || order.riderId === session.user.linkedProfileId
        : order.status === ORDER_STATUS.readyForPickup || order.riderId === selectedRiderId,
    ) ?? []
  )
}

export function getCustomerOrderCollections(
  state: DeliveryPageDerivedState,
  activeCustomerId: string,
  routeOrderId?: string,
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

export function getMerchantApplicationCollections(
  state: DeliveryPageDerivedState,
  session: SessionState['session'],
) {
  return {
    pendingApplications:
      state?.merchantApplications.filter(
        (entry: DeliveryAppState['merchantApplications'][number]) =>
          entry.status === APPLICATION_STATUS.pending,
      ) ?? [],
    merchantPendingApplications:
      state?.merchantApplications.filter(
        (entry: DeliveryAppState['merchantApplications'][number]) =>
          entry.merchantName === session?.user.displayName &&
          entry.status === APPLICATION_STATUS.pending,
      ) ?? [],
    merchantReviewedApplications:
      state?.merchantApplications.filter(
        (entry: DeliveryAppState['merchantApplications'][number]) =>
          entry.merchantName === session?.user.displayName &&
          entry.status !== APPLICATION_STATUS.pending,
      ) ?? [],
  }
}

export function getReviewAndSupportCollections(state: DeliveryPageDerivedState) {
  return {
    pendingAppeals:
      state?.reviewAppeals.filter(
        (entry: DeliveryAppState['reviewAppeals'][number]) =>
          entry.status === APPLICATION_STATUS.pending,
      ) ?? [],
    pendingEligibilityReviews:
      state?.eligibilityReviews.filter(
        (entry: DeliveryAppState['eligibilityReviews'][number]) =>
          entry.status === APPLICATION_STATUS.pending,
      ) ?? [],
    afterSalesTickets:
      state?.tickets.filter(
        (entry: DeliveryAppState['tickets'][number]) => entry.kind === TICKET_KIND.deliveryIssue,
      ) ?? [],
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
  customerStoreSearch: string,
  selectedStoreCategory: string,
) {
  const normalizedCustomerStoreSearch = customerStoreSearch.trim().toLowerCase()
  const visibleStores =
    state?.stores
      .filter((store: Store) =>
        normalizedCustomerStoreSearch
          ? store.name.toLowerCase().includes(normalizedCustomerStoreSearch) ||
            store.merchantName.toLowerCase().includes(normalizedCustomerStoreSearch)
          : true,
      )
      .slice()
      .sort(
        (left: Store, right: Store) =>
          right.averageRating - left.averageRating || right.ratingCount - left.ratingCount,
      ) ?? []

  return {
    visibleStores,
    categoryStores: visibleStores.filter((store: Store) => store.category === selectedStoreCategory),
  }
}

export function getDerivedCollections(
  state: DeliveryPageDerivedState,
  session: SessionState['session'],
  activeCustomerId: string,
  routeOrderId: string | undefined,
  customerStoreSearch: string,
  selectedStoreCategory: string,
  selectedStore: Store | undefined,
  merchantStores: Store[],
) {
  const customerOrders = getCustomerOrderCollections(state, activeCustomerId, routeOrderId)
  return {
    ...customerOrders,
    ...getMerchantApplicationCollections(state, session),
    ...getReviewAndSupportCollections(state),
    ...getCustomerNoticeCollections(
      state?.customers.find((customer) => customer.id === activeCustomerId),
      customerOrders.customerOrders,
      customerOrders.completedCustomerOrders,
      state?.tickets ?? [],
    ),
    ...getCustomerStoreCollections(state, customerStoreSearch, selectedStoreCategory),
    ...getAnalyticsCollections(state, merchantStores, selectedStore),
    storeCategories: STORE_CATEGORIES,
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
