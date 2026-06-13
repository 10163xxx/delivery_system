import type {
  Customer,
  CustomerId,
  DeliveryAppState,
  MerchantProfile,
  OrderId,
  OrderSummary,
  RiderId,
  Rider,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import {
  APPLICATION_STATUS,
  ORDER_STATUS,
  ROLE,
  TICKET_KIND,
} from '@/objects/core/SharedObjects'
import { CUSTOMER_FAVORITE_STORE_CATEGORY, STORE_CATEGORIES } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { canReviewOrder } from '@/pages/DeliveryConsole/functions/review/DeliveryReview'
import { getStoreDeliveryQuote } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import type {
  DeliveryPageDerivedState,
  SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import {
  getAnalyticsCollections,
  getResolvedAfterSalesNoticeIds,
} from '@/pages/DeliveryConsole/functions/viewData/DeliveryAnalyticsViewData'

const CUSTOMER_PROFILE_PENDING_ADDRESS = '请先完善默认地址'

export function getActiveCustomerId(
  session: SessionState['session'],
  selectedCustomerId: CustomerId | '',
) {
  return session?.user.role === ROLE.customer && session.user.linkedProfileId
    ? (session.user.linkedProfileId as unknown as CustomerId)
    : selectedCustomerId
}

export function getSelectedEntities(input: {
  state: DeliveryPageDerivedState
  session: SessionState['session']
  activeCustomerId: CustomerId | ''
  selectedStoreId: StoreId | ''
  selectedRiderId: RiderId | ''
  blockedStoreIds: StoreId[]
}) {
  const { state, session, activeCustomerId, selectedStoreId, selectedRiderId, blockedStoreIds } = input

  return {
    selectedStore: state?.stores.find(
      (store) => store.id === selectedStoreId && !blockedStoreIds.includes(store.id),
    ),
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
  selectedRiderId: RiderId | '',
) {
  const activeRiderId =
    session?.user.role === ROLE.rider && session.user.linkedProfileId
      ? (session.user.linkedProfileId as unknown as RiderId)
      : selectedRiderId

  const isActiveRiderOrder = (order: OrderSummary) =>
    order.riderId === activeRiderId &&
    (order.status === ORDER_STATUS.readyForPickup || order.status === ORDER_STATUS.delivering)

  const isAvailableOrder = (order: OrderSummary) =>
    order.status === ORDER_STATUS.readyForPickup && !order.riderId

  const isHistoryOrder = (order: OrderSummary) =>
    order.riderId === activeRiderId && order.status === ORDER_STATUS.completed

  return {
    riderOrders: state?.orders.filter(isActiveRiderOrder) ?? [],
    riderAvailableOrders: state?.orders.filter(isAvailableOrder) ?? [],
    riderHistoryOrders: state?.orders.filter(isHistoryOrder) ?? [],
  }
}

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

export function getReviewAndTicketCollections(state: DeliveryPageDerivedState) {
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

export type DerivedCollectionsParams = {
  state: DeliveryPageDerivedState
  session: SessionState['session']
  activeCustomerId: CustomerId | ''
  routeOrderId: OrderId | undefined
  customerStoreSearch: string
  selectedStoreCategory: string
  favoriteStoreIds: StoreId[]
  blockedStoreIds: StoreId[]
  selectedStore: Store | undefined
  merchantStores: Store[]
}

export function getDerivedCollections(params: DerivedCollectionsParams) {
  const {
    state,
    session,
    activeCustomerId,
    routeOrderId,
    customerStoreSearch,
    selectedStoreCategory,
    favoriteStoreIds,
    blockedStoreIds,
    selectedStore,
    merchantStores,
  } = params
  const customerOrders = getCustomerOrderCollections(state, activeCustomerId, routeOrderId)
  return {
    ...customerOrders,
    ...getMerchantApplicationCollections(state, session),
    ...getReviewAndTicketCollections(state),
    ...getCustomerNoticeCollections(
      state?.customers.find((customer) => customer.id === activeCustomerId),
      customerOrders.customerOrders,
      customerOrders.completedCustomerOrders,
      state?.tickets ?? [],
    ),
    ...getCustomerStoreCollections(
      state,
      state?.customers.find((customer) => customer.id === activeCustomerId),
      customerStoreSearch,
      selectedStoreCategory,
      favoriteStoreIds,
      blockedStoreIds,
    ),
    ...getAnalyticsCollections(state, merchantStores, selectedStore, customerOrders.customerOrders),
    storeCategories: [...STORE_CATEGORIES, CUSTOMER_FAVORITE_STORE_CATEGORY],
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
