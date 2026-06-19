package system.app

// Business note: application-level business orchestration and derived state shared by service actions.
import services.auth.objects.*
import system.app.objects.*
import services.order.objects.*
import services.review.objects.*
import system.objects.*

private[app] def projectStateForUser(state: DeliveryAppState, user: AuthAccount): DeliveryAppState =
    user.role match
      case UserRole.admin => state
      case UserRole.customer => projectCustomerState(state, user.linkedProfileId)
      case UserRole.merchant => projectMerchantState(state, user.displayName)
      case UserRole.rider => projectRiderState(state, user.linkedProfileId)

private def projectCustomerState(
    state: DeliveryAppState,
    linkedProfileId: Option[EntityId],
): DeliveryAppState =
    val visibleCustomers = state.customers.filter(customer => linkedProfileId.exists(_.raw == customer.id.raw))
    val ownOrders = state.orders.filter(order => linkedProfileId.exists(_.raw == order.customerId.raw))
    val publicStoreReviewOrders = state.orders.filter(order =>
      order.status == OrderStatus.Completed &&
        order.reviewStatus == ReviewStatus.Active &&
        order.storeRating.nonEmpty
    )
    val visibleOrders = (ownOrders ++ publicStoreReviewOrders).distinctBy(_.id.raw)
    val ownOrderIds = ownOrders.map(_.id.raw)

    state.copy(
      customers = visibleCustomers,
      merchantProfiles = List.empty,
      riders = List.empty,
      admins = List.empty,
      merchantApplications = List.empty,
      reviewAppeals = List.empty,
      eligibilityReviews = List.empty,
      deliveryState = state.deliveryState.copy(
        orders = visibleOrders,
        tickets = state.tickets.filter(ticket => ownOrderIds.contains(ticket.orderId.raw)),
      ),
    )

private def projectMerchantState(
    state: DeliveryAppState,
    merchantName: PersonName,
): DeliveryAppState =
    val visibleStores = state.stores.filter(_.merchantName == merchantName)
    val visibleStoreIds = visibleStores.map(_.id.raw)
    val visibleOrders = state.orders.filter(order => visibleStoreIds.contains(order.storeId.raw))

    state.copy(
      customers = List.empty,
      stores = visibleStores,
      merchantProfiles = state.merchantProfiles.filter(_.merchantName == merchantName),
      riders = List.empty,
      admins = List.empty,
      merchantApplications = state.merchantApplications.filter(_.merchantName == merchantName),
      reviewAppeals = state.reviewAppeals.filter(appeal => visibleStoreIds.contains(appeal.storeId.raw)),
      eligibilityReviews = state.eligibilityReviews.filter(review =>
        review.target == EligibilityReviewTarget.Store && visibleStoreIds.contains(review.targetId.raw)
      ),
      deliveryState = state.deliveryState.copy(
        orders = visibleOrders,
        tickets = List.empty,
      ),
    )

private def projectRiderState(
    state: DeliveryAppState,
    linkedProfileId: Option[EntityId],
): DeliveryAppState =
    val visibleRiders = state.riders.filter(rider => linkedProfileId.exists(_.raw == rider.id.raw))
    val visibleOrders = state.orders.filter(order =>
      order.status == OrderStatus.ReadyForPickup || order.riderId.exists(riderId => linkedProfileId.exists(_.raw == riderId.raw))
    )

    state.copy(
      customers = List.empty,
      stores = List.empty,
      merchantProfiles = List.empty,
      riders = visibleRiders,
      admins = List.empty,
      merchantApplications = List.empty,
      reviewAppeals = state.reviewAppeals.filter(appeal =>
        appeal.riderId.exists(riderId => linkedProfileId.exists(_.raw == riderId.raw))
      ),
      eligibilityReviews = state.eligibilityReviews.filter(review =>
        review.target == EligibilityReviewTarget.Rider && linkedProfileId.exists(_.raw == review.targetId.raw)
      ),
      deliveryState = state.deliveryState.copy(
        orders = visibleOrders,
        tickets = List.empty,
      ),
    )
