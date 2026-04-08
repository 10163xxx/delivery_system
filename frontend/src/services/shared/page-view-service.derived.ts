import type {
  Customer,
  DeliveryAppState,
  MerchantProfile,
  OrderSummary,
  Rider,
  Store,
} from '@/domain'
import {
  STORE_CATEGORIES,
  canReviewOrder,
  isStoreCurrentlyOpen,
  type MerchantWorkspaceView,
} from '@/features/delivery-console'
import type { SessionState } from './page-view-service.types'

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
    session?.user.role === 'customer' && session.user.linkedProfileId
      ? session.user.linkedProfileId
      : selectedCustomerId

  const selectedStore = state?.stores.find((store: Store) => store.id === selectedStoreId)
  const selectedCustomer = state?.customers.find(
    (customer: Customer) => customer.id === activeCustomerId,
  )
  const merchantStores =
    state?.stores.filter((store: Store) =>
      session?.user.role === 'merchant'
        ? store.merchantName === session.user.displayName
        : true,
    ) ?? []
  const merchantProfile: MerchantProfile | undefined = state?.merchantProfiles.find(
    (profile: MerchantProfile) => profile.merchantName === session?.user.displayName,
  )
  const selectedRider = state?.riders.find((rider: Rider) => rider.id === selectedRiderId)
  const riderOrders =
    state?.orders.filter((order: OrderSummary) =>
      session?.user.role === 'rider'
        ? order.status === 'ReadyForPickup' || order.riderId === session.user.linkedProfileId
        : order.status === 'ReadyForPickup' || order.riderId === selectedRiderId,
    ) ?? []
  const customerOrders =
    state?.orders.filter((order: OrderSummary) => order.customerId === activeCustomerId) ?? []
  const completedCustomerOrders = customerOrders.filter(
    (order: OrderSummary) => order.status === 'Completed',
  )
  const pendingCustomerReviewOrders = completedCustomerOrders.filter((order: OrderSummary) =>
    canReviewOrder(order),
  )
  const activeCustomerOrder =
    customerOrders.find((order: OrderSummary) => order.id === routeOrderId) ?? null
  const activeReviewOrder =
    customerOrders.find((order: OrderSummary) => order.id === routeOrderId) ?? null
  const pendingApplications =
    state?.merchantApplications.filter((entry) => entry.status === 'Pending') ?? []
  const merchantPendingApplications =
    state?.merchantApplications.filter(
      (entry) => entry.merchantName === session?.user.displayName && entry.status === 'Pending',
    ) ?? []
  const merchantReviewedApplications =
    state?.merchantApplications.filter(
      (entry) => entry.merchantName === session?.user.displayName && entry.status !== 'Pending',
    ) ?? []
  const pendingAppeals = state?.reviewAppeals.filter((entry) => entry.status === 'Pending') ?? []
  const pendingEligibilityReviews =
    state?.eligibilityReviews.filter((entry) => entry.status === 'Pending') ?? []
  const afterSalesTickets = state?.tickets.filter((entry) => entry.kind === 'DeliveryIssue') ?? []
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
    storeCategories: STORE_CATEGORIES,
    categoryStores,
    selectedStoreIsOpen,
    selectedMerchantStoreId,
    merchantWorkspaceView,
  }
}
