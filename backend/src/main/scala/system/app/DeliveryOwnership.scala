package system.app

// Business note: application-level business orchestration and derived state shared by service actions.
import services.order.objects.*
import services.rider.objects.*
import services.merchant.objects.*
import services.customer.objects.*
import system.objects.*

def ownsCustomer(customerId: CustomerId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    new ApprovalFlag(linkedProfileId.exists(_.raw == customerId.raw))

def ownsOrderAsCustomer(orderId: OrderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    new ApprovalFlag(stateRef.get().orders.exists(order => order.id == orderId && linkedProfileId.exists(_.raw == order.customerId.raw)))

def ownsStore(storeId: StoreId, merchantName: PersonName): ApprovalFlag =
    new ApprovalFlag(stateRef.get().stores.exists(store => store.id == storeId && store.merchantName == merchantName))

def ownsOrderAsMerchant(orderId: OrderId, merchantName: PersonName): ApprovalFlag =
    val current = stateRef.get()
    new ApprovalFlag(
      current.orders.exists(order =>
        order.id == orderId && current.stores.exists(store => store.id == order.storeId && store.merchantName == merchantName)
      )
    )

def ownsMerchantApplication(applicationId: MerchantApplicationId, merchantName: PersonName): ApprovalFlag =
    new ApprovalFlag(
      stateRef.get().merchantApplications.exists(application =>
        application.id == applicationId && application.merchantName == merchantName
      )
    )

def ownsMerchantProfile(merchantName: PersonName, linkedProfileId: Option[EntityId]): ApprovalFlag =
    val current = stateRef.get()
    new ApprovalFlag(
      linkedProfileId.exists(profileId =>
        current.merchantProfiles.exists(profile => profile.id.raw == profileId.raw && profile.merchantName == merchantName)
      ) || current.merchantProfiles.exists(_.merchantName == merchantName)
    )

def ownsRiderProfile(riderId: RiderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    new ApprovalFlag(linkedProfileId.exists(_.raw == riderId.raw))

def ownsOrderAsRider(orderId: OrderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    new ApprovalFlag(
      stateRef.get().orders.exists(order =>
        order.id == orderId && order.riderId.exists(riderId => linkedProfileId.exists(_.raw == riderId.raw))
      )
    )
