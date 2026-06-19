package system.app

// Business note: application-level business orchestration and derived state shared by service actions.
import system.objects.given
import system.app.objects.*

import services.customer.objects.*
import services.merchant.objects.*
import services.merchant.utils.*
import services.order.objects.*
import services.review.objects.*
import services.rider.objects.*
import system.objects.*

def refreshState(state: DeliveryAppState, currentTime: IsoDateTime): DeliveryAppState =
    withDerivedData(applyAutomaticDispatch(state, currentTime), currentTime)

def withDerivedData(state: DeliveryAppState): DeliveryAppState =
    withDerivedData(state, now())

def withDerivedData(state: DeliveryAppState, currentTime: IsoDateTime): DeliveryAppState =
    val reviewCollections = collectReviewDerivedCollections(state)
    val customerCollections =
      collectCustomerDerivedCollections(
        state,
        reviewCollections.revokedReviewedOrders,
        currentTime,
      )
    val storeRevenue = revenueByStore(state.orders)
    val nextCustomers =
      deriveCustomers(state.customers, customerCollections, currentTime)
    val nextOrders = deriveOrdersWithCustomerAliases(state.orders)
    val nextAppeals = deriveAppealsWithCustomerAliases(state.reviewAppeals)
    val nextStores = deriveStores(state.stores, reviewCollections, storeRevenue)
    val nextRiders = deriveRiders(state.riders, state.orders, reviewCollections)
    val nextAdmins =
      deriveAdmins(
        state.admins,
        completedOrderItemSubtotalCents(state.orders),
        nextStores,
        nextRiders,
      )
    val nextMerchantProfiles =
      mergeMerchantProfiles(state, settledIncomeByMerchant(nextStores))

    state.copy(
      customers = nextCustomers,
      reviewAppeals = nextAppeals,
      stores = nextStores,
      admins = nextAdmins,
      merchantProfiles = nextMerchantProfiles,
      riders = nextRiders,
      deliveryState = state.deliveryState.copy(
        orders = nextOrders,
        metrics = deriveSystemMetrics(state, reviewCollections.activeReviewedOrders),
      ),
    )
