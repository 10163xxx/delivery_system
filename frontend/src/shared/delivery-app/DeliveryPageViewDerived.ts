import type {
  Customer,
  DeliveryAppState,
  MerchantProfile,
  OrderSummary,
  Rider,
  Store,
} from '@/shared/object/SharedObjects'
import {
  APPLICATION_STATUS,
  ORDER_STATUS,
  REVIEW_STATUS,
  ROLE,
  TICKET_KIND,
} from '@/shared/object/SharedObjects'
import {
  STORE_CATEGORIES,
  canReviewOrder,
  getOrderReviewEligibilityTime,
  isStoreCurrentlyOpen,
} from '@/shared/delivery/DeliveryServices'
import type { MerchantWorkspaceView } from '@/shared/delivery-app/DeliveryAppObjects'
import type { SessionState } from './DeliveryPageViewTypes'

type DerivedArgs = {
  routeOrderId?: string
  sessionService: SessionState
  selectedCustomerId: string
  selectedStoreCategory: string
  selectedStoreId: string
  selectedMerchantStoreId: string
  selectedRiderId: string
  customerStoreSearch: string
  merchantWorkspaceView: MerchantWorkspaceView
}

function getStoreCustomerReviews(orders: OrderSummary[]) {
  return orders
    .flatMap((order: OrderSummary) => {
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

export function getDeliveryConsolePageViewDerived(args: DerivedArgs) {
  const {
    routeOrderId,
    sessionService,
    selectedCustomerId,
    selectedStoreCategory,
    selectedStoreId,
    selectedMerchantStoreId,
    selectedRiderId,
    customerStoreSearch,
    merchantWorkspaceView,
  } = args
  const { session, state } = sessionService

  const activeCustomerId =
    session?.user.role === ROLE.customer && session.user.linkedProfileId
      ? session.user.linkedProfileId
      : selectedCustomerId

  const selectedStore = state?.stores.find((store: Store) => store.id === selectedStoreId)
  const selectedCustomer = state?.customers.find(
    (customer: Customer) => customer.id === activeCustomerId,
  )
  const merchantStores =
    state?.stores.filter((store: Store) =>
      session?.user.role === ROLE.merchant
        ? store.merchantName === session.user.displayName
        : true,
    ) ?? []
  const merchantProfile: MerchantProfile | undefined = state?.merchantProfiles.find(
    (profile: MerchantProfile) => profile.merchantName === session?.user.displayName,
  )
  const selectedRider = state?.riders.find((rider: Rider) => rider.id === selectedRiderId)
  const riderOrders =
    state?.orders.filter((order: OrderSummary) =>
      session?.user.role === ROLE.rider
        ? order.status === ORDER_STATUS.readyForPickup || order.riderId === session.user.linkedProfileId
        : order.status === ORDER_STATUS.readyForPickup || order.riderId === selectedRiderId,
    ) ?? []
  const customerOrders =
    state?.orders.filter((order: OrderSummary) => order.customerId === activeCustomerId) ?? []
  const completedCustomerOrders = customerOrders.filter(
    (order: OrderSummary) => order.status === ORDER_STATUS.completed,
  )
  const pendingCustomerReviewOrders = completedCustomerOrders.filter((order: OrderSummary) =>
    canReviewOrder(order),
  )
  const activeCustomerOrder =
    customerOrders.find((order: OrderSummary) => order.id === routeOrderId) ?? null
  const activeReviewOrder =
    customerOrders.find((order: OrderSummary) => order.id === routeOrderId) ?? null
  const pendingApplications =
    state?.merchantApplications.filter((entry) => entry.status === APPLICATION_STATUS.pending) ?? []
  const merchantPendingApplications =
    state?.merchantApplications.filter(
      (entry) => entry.merchantName === session?.user.displayName && entry.status === APPLICATION_STATUS.pending,
    ) ?? []
  const merchantReviewedApplications =
    state?.merchantApplications.filter(
      (entry) => entry.merchantName === session?.user.displayName && entry.status !== APPLICATION_STATUS.pending,
    ) ?? []
  const pendingAppeals = state?.reviewAppeals.filter((entry) => entry.status === APPLICATION_STATUS.pending) ?? []
  const pendingEligibilityReviews =
    state?.eligibilityReviews.filter((entry) => entry.status === APPLICATION_STATUS.pending) ?? []
  const afterSalesTickets = state?.tickets.filter((entry) => entry.kind === TICKET_KIND.deliveryIssue) ?? []
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
  const categoryStores = visibleStores.filter(
    (store: Store) => store.category === selectedStoreCategory,
  )
  const selectedStoreIsOpen = selectedStore ? isStoreCurrentlyOpen(selectedStore) : false
  const storeCustomerReviews = getStoreCustomerReviews(state?.orders ?? [])

  return {
    state: state as DeliveryAppState | null,
    activeCustomerId,
    selectedStore,
    selectedCustomer,
    merchantStores,
    merchantProfile,
    selectedRider,
    riderOrders,
    customerOrders,
    completedCustomerOrders,
    pendingCustomerReviewOrders,
    activeCustomerOrder,
    activeReviewOrder,
    pendingApplications,
    merchantPendingApplications,
    merchantReviewedApplications,
    pendingAppeals,
    pendingEligibilityReviews,
    afterSalesTickets,
    visibleStores,
    storeCustomerReviews,
    storeCategories: STORE_CATEGORIES,
    categoryStores,
    selectedStoreIsOpen,
    selectedMerchantStoreId,
    merchantWorkspaceView,
  }
}
