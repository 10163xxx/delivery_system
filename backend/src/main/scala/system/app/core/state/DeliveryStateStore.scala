package system.app

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.rider.*
import domain.shared.*
import system.{withTransactionConnection, withTransactionConnectionBlocking}
import system.app.core.table.{initializeDeliveryStateTable, loadPersistedDeliveryState, savePersistedDeliveryState, savePersistedDeliveryStateBlocking}

import java.time.Instant
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

private val pendingAddress = DeliveryDefaultCustomerAddress
private val defaultAddressLabel = new AddressLabel("默认")
private val riderVehiclePending = new VehicleLabel("待完善")
private val riderZonePending = new ZoneLabel("待分区")
private val riderAvailable = RiderAvailableStatus
private val emptyPhoneNumber = new PhoneNumber("")
private val adminSelfRegistrationMessage = new ErrorMessage("管理员账号不能自助注册")
private val userAliasPrefix = new DisplayText("用户")
private val customerPhonePrefix = "139"

val writeLock = new AnyRef
val stateRef = new AtomicReference[DeliveryAppState](emptyDeliveryAppState())
// The in-memory state is the live app snapshot; each mutating action persists through DeliveryStateTable.

def initializeDeliveryStatePersistence: IO[Unit] =
  withTransactionConnection { connection =>
    for
      _ <- initializeDeliveryStateTable(connection)
      initialState <- loadPersistedDeliveryState(connection).map(_.getOrElse(emptyDeliveryAppState()))
      _ <- IO(stateRef.set(initialState))
    yield ()
  }

def getState: IO[DeliveryAppState] =
  withTransactionConnection { connection =>
    IO.blocking {
      writeLock.synchronized {
        val refreshed = refreshState(stateRef.get(), now())
        stateRef.set(refreshed)
        refreshed
      }
    }.flatTap(refreshed => savePersistedDeliveryState(connection, refreshed))
  }

def getStateForUser(user: AuthAccount): IO[DeliveryAppState] =
  getState.map(state => projectStateForUser(state, user))

def registerUserProfile(role: UserRole, displayName: PersonName): Either[ErrorMessage, Option[EntityId]] =
  role match
      case UserRole.customer => registerCustomerProfile()
      case UserRole.rider => registerRiderProfile(displayName)
      case UserRole.merchant => registerMerchantProfile(displayName)
      case UserRole.admin =>
        Left(adminSelfRegistrationMessage)

private def registerCustomerProfile(): Either[ErrorMessage, Option[EntityId]] =
    val customerId = nextId[CustomerId](new DisplayText("cust"))
    val registrationCoupons = initialRegistrationCoupons(customerId, now())
    updateState { current =>
      Right(
        withDerivedData(
          current.copy(
            customers = buildCustomerProfile(customerId, registrationCoupons) :: current.customers,
          )
        )
      )
    }.map(_ => Some(new EntityId(customerId.raw)))

private def buildCustomerProfile(
    customerId: CustomerId,
    registrationCoupons: List[Coupon],
): Customer =
    Customer(
      id = customerId,
      name = customerAlias(customerId),
      phone = generatedCustomerPhone(customerId),
      defaultAddress = pendingAddress,
      location = None,
      addresses = List(AddressEntry(defaultAddressLabel, pendingAddress, None)),
      accountStatus = AccountStatus.Active,
      metrics = CustomerMetrics(
        revokedReviewCount = NumericDefaults.ZeroCount,
        membershipTier = MembershipTier.Standard,
        monthlySpendCents = NumericDefaults.ZeroCurrencyCents,
        balanceCents = NumericDefaults.ZeroCurrencyCents,
        coupons = registrationCoupons,
      ),
    )

private def generatedCustomerPhone(customerId: CustomerId): PhoneNumber =
    val generatedSuffix =
      customerId.raw
        .filter(_.isDigit)
        .padTo(AuthDefaults.GeneratedIdSuffixLength, NumericDefaults.ZeroDigitChar)
        .mkString
        .take(AuthDefaults.GeneratedIdSuffixLength)
    new PhoneNumber(List(customerPhonePrefix, generatedSuffix).mkString)

private def registerRiderProfile(displayName: PersonName): Either[ErrorMessage, Option[EntityId]] =
    val riderId = nextId[RiderId](RiderIdPrefix)
    updateState { current =>
      Right(
        withDerivedData(
          current.copy(
            riders = buildRiderProfile(riderId, displayName) :: current.riders,
          )
        )
      )
    }.map(_ => Some(new EntityId(riderId.raw)))

private def buildRiderProfile(riderId: RiderId, displayName: PersonName): Rider =
    Rider(
      id = riderId,
      name = displayName,
      vehicle = riderVehiclePending,
      zone = riderZonePending,
      availability = riderAvailable,
      performance = RiderPerformance(
        averageRating = NumericDefaults.ZeroAverageRating,
        ratingCount = NumericDefaults.ZeroCount,
        oneStarRatingCount = NumericDefaults.ZeroCount,
        earningsCents = NumericDefaults.ZeroCurrencyCents,
      ),
      payout = RiderPayout(
        payoutAccount = None,
        withdrawnCents = NumericDefaults.ZeroCurrencyCents,
        availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
        withdrawalHistory = List.empty,
      ),
    )

private def registerMerchantProfile(displayName: PersonName): Either[ErrorMessage, Option[EntityId]] =
    val merchantProfileId = nextId[MerchantId](MerchantIdPrefix)
    updateState { current =>
      Right(
        withDerivedData(
          current.copy(
            merchantProfiles =
              buildMerchantProfile(merchantProfileId, displayName) :: current.merchantProfiles.filterNot(_.merchantName == displayName),
          )
        )
      )
    }.map(_ => Some(new EntityId(merchantProfileId.raw)))

private def buildMerchantProfile(merchantProfileId: MerchantId, displayName: PersonName): MerchantProfile =
    MerchantProfile(
      id = merchantProfileId,
      merchantName = displayName,
      contactPhone = emptyPhoneNumber,
      payoutAccount = None,
      settledIncomeCents = NumericDefaults.ZeroCurrencyCents,
      withdrawnCents = NumericDefaults.ZeroCurrencyCents,
      availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
      withdrawalHistory = List.empty,
    )

def customerAlias(customerId: CustomerId): PersonName =
    val digits = customerId.raw.filter(_.isDigit)
    val suffix =
      if digits.nonEmpty then
        digits
          .takeRight(DeliveryBusinessDefaults.CustomerAliasLength)
          .reverse
          .padTo(DeliveryBusinessDefaults.CustomerAliasLength, NumericDefaults.ZeroDigitChar)
          .reverse
          .mkString
      else NumericDefaults.ZeroDigitText.raw * DeliveryBusinessDefaults.CustomerAliasLength
    new PersonName(List(userAliasPrefix.raw, suffix).mkString)

def ownsCustomer(customerId: CustomerId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    linkedProfileId.exists(_.raw == customerId.raw)

def ownsOrderAsCustomer(orderId: OrderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    stateRef.get().orders.exists(order => order.id == orderId && linkedProfileId.exists(_.raw == order.customerId.raw))

def ownsStore(storeId: StoreId, merchantName: PersonName): ApprovalFlag =
    stateRef.get().stores.exists(store => store.id == storeId && store.merchantName == merchantName)

def ownsOrderAsMerchant(orderId: OrderId, merchantName: PersonName): ApprovalFlag =
    val current = stateRef.get()
    current.orders.exists(order =>
      order.id == orderId && current.stores.exists(store => store.id == order.storeId && store.merchantName == merchantName)
    )

def ownsMerchantApplication(applicationId: MerchantApplicationId, merchantName: PersonName): ApprovalFlag =
    stateRef.get().merchantApplications.exists(application =>
      application.id == applicationId && application.merchantName == merchantName
    )

def ownsMerchantProfile(merchantName: PersonName, linkedProfileId: Option[EntityId]): ApprovalFlag =
    val current = stateRef.get()
    linkedProfileId.exists(profileId =>
      current.merchantProfiles.exists(profile => profile.id.raw == profileId.raw && profile.merchantName == merchantName)
    ) || current.merchantProfiles.exists(_.merchantName == merchantName)

def ownsRiderProfile(riderId: RiderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    linkedProfileId.exists(_.raw == riderId.raw)

def ownsOrderAsRider(orderId: OrderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    stateRef.get().orders.exists(order =>
      order.id == orderId && order.riderId.exists(riderId => linkedProfileId.exists(_.raw == riderId.raw))
    )

private def projectStateForUser(state: DeliveryAppState, user: AuthAccount): DeliveryAppState =
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

def transitionOrder(
      orderId: OrderId,
      expected: OrderStatus,
      next: OrderStatus,
      note: DisplayText,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)
          _ <- Either.cond(order.status == expected, (), orderStatusMismatch(expected))
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                fulfillment = entry.fulfillment.copy(status = next),
                lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
                activity = entry.activity.copy(
                  timeline = entry.timeline :+ OrderTimelineEntry(next, note, timestamp)
                ),
              )
            else entry
          )
          withDerivedData(current.copy(deliveryState = current.deliveryState.copy(orders = nextOrders)))
      }
    }

def updateState(
      mutate: DeliveryAppState => Either[ErrorMessage, DeliveryAppState]
  ): Either[ErrorMessage, DeliveryAppState] =
    writeLock.synchronized {
      val current = refreshState(stateRef.get(), now())
      mutate(current).map(next =>
        val refreshed = refreshState(next, now())
        withTransactionConnectionBlocking(connection => savePersistedDeliveryStateBlocking(connection, refreshed))
        stateRef.set(refreshed)
        refreshed
      )
    }

def nextId[T](prefix: DisplayText)(using wrapped: WrappedTextType[T]): T =
  wrapText[T](List(prefix.raw, "-", UUID.randomUUID().toString.take(DeliveryBusinessDefaults.GeneratedIdSuffixLength)).mkString)

def now(): IsoDateTime = new IsoDateTime(Instant.now().toString)

private def emptyDeliveryAppState(): DeliveryAppState =
  DeliveryAppState(
    customers = List.empty,
    stores = List.empty,
    merchantProfiles = List.empty,
    riders = List.empty,
    admins = List.empty,
    merchantApplications = List.empty,
    reviewAppeals = List.empty,
    eligibilityReviews = List.empty,
    deliveryState = DeliveryOrderState(
      orders = List.empty,
      tickets = List.empty,
      metrics = SystemMetrics(NumericDefaults.ZeroCount, NumericDefaults.ZeroCount, NumericDefaults.ZeroCount, NumericDefaults.ZeroAverageRating),
    ),
  )
