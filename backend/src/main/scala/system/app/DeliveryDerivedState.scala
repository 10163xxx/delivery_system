package system.app

import domain.shared.given

import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.rider.*
import domain.shared.*

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
