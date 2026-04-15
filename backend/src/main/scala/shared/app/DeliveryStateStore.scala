package shared.app

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.rider.*
import domain.shared.*
import shared.infra.files.{loadOrCreateJsonFile, writeJsonFile}

import java.time.{Instant, ZoneId}
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

val OneStarRevocationThreshold = DeliveryBusinessDefaults.OneStarRevocationThreshold
val CustomerBanThreshold = DeliveryBusinessDefaults.CustomerBanThreshold
val MemberMonthlySpendThresholdCents = DeliveryBusinessDefaults.MemberMonthlySpendThresholdCents
val StandardAutoDispatchMinutes = DeliveryBusinessDefaults.StandardAutoDispatchMinutes
val MemberAutoDispatchMinutes = DeliveryBusinessDefaults.MemberAutoDispatchMinutes
val MonthlyWindowDays = DeliveryBusinessDefaults.MonthlyWindowDays
val ReviewWindowDays = DeliveryBusinessDefaults.ReviewWindowDays
val MinimumScheduledLeadMinutes = DeliveryBusinessDefaults.MinimumScheduledLeadMinutes
val DeliveryFeeCents = DeliveryBusinessDefaults.DeliveryFeeCents
val RiderEarningPerOrderCents = DeliveryBusinessDefaults.RiderEarningPerOrderCents
val MerchantRevenueShareNumerator = DeliveryBusinessDefaults.MerchantRevenueShareNumerator
val MerchantRevenueShareDenominator = DeliveryBusinessDefaults.MerchantRevenueShareDenominator
val StoreOpenStatus = DeliveryBusinessDefaults.StoreOpenStatus
val StoreBusyStatus = DeliveryBusinessDefaults.StoreBusyStatus
val StoreRevokedStatus = DeliveryBusinessDefaults.StoreRevokedStatus
val RiderAvailableStatus = DeliveryBusinessDefaults.RiderAvailableStatus
val RiderOnDeliveryStatus = DeliveryBusinessDefaults.RiderOnDeliveryStatus
val RiderSuspendedStatus = DeliveryBusinessDefaults.RiderSuspendedStatus
val OrderIdPrefix = DeliveryBusinessDefaults.OrderIdPrefix
val MerchantAcceptedTimelineNote = DeliveryBusinessDefaults.MerchantAcceptedTimelineNote
val MerchantPreparedTimelineNote = DeliveryBusinessDefaults.MerchantPreparedTimelineNote
val RiderPickedUpTimelineNote = DeliveryBusinessDefaults.RiderPickedUpTimelineNote
val RiderDeliveredTimelineNote = DeliveryBusinessDefaults.RiderDeliveredTimelineNote
val CouponSpendStepCents = DeliveryBusinessDefaults.CouponSpendStepCents
val CouponValidityDays = DeliveryBusinessDefaults.CouponValidityDays
val MemberTierCouponValidityDays = DeliveryBusinessDefaults.MemberTierCouponValidityDays
val WelcomeCouponCount = DeliveryBusinessDefaults.WelcomeCouponCount
val WelcomeCouponTemplate = DeliveryBusinessDefaults.WelcomeCouponTemplate
val MemberTierCouponTemplate = DeliveryBusinessDefaults.MemberTierCouponTemplate
val MerchantIdPrefix = DeliveryBusinessDefaults.MerchantIdPrefix
val RiderIdPrefix = DeliveryBusinessDefaults.RiderIdPrefix
val DeliveryScheduleZone = ZoneId.systemDefault()
val StoreCategories = List(
  new DisplayText("中式快餐"),
  new DisplayText("盖饭简餐"),
  new DisplayText("面馆粉档"),
  new DisplayText("麻辣香锅"),
  new DisplayText("饺子馄饨"),
  new DisplayText("轻食沙拉"),
  new DisplayText("咖啡甜点"),
  new DisplayText("奶茶果饮"),
  new DisplayText("夜宵小吃"),
)
val SpendRewardCouponTemplates = DeliveryBusinessDefaults.SpendRewardCouponTemplates
private val pendingAddress = new AddressText("请先完善默认地址")
private val defaultAddressLabel = new AddressLabel("默认")
private val riderVehiclePending = new VehicleLabel("待完善")
private val riderZonePending = new ZoneLabel("待分区")
private val riderAvailable = RiderAvailableStatus
private val emptyPhoneNumber = new PhoneNumber("")
private val adminSelfRegistrationMessage = new ErrorMessage("管理员账号不能自助注册")
private val userAliasPrefix = new DisplayText("用户")
private val customerPhonePrefix = "139"

val stateFile = sys.env
  .get(DeliveryRuntimeDefaults.StateFileEnv.raw)
  .map(java.nio.file.Paths.get(_))
  .getOrElse(DeliveryRuntimeDefaults.StateFilePath)
val writeLock = new AnyRef
val stateRef = new AtomicReference[DeliveryAppState](loadState())

def getState: IO[DeliveryAppState] =
  IO.blocking {
    writeLock.synchronized {
      val refreshed = refreshState(stateRef.get(), now())
      saveState(refreshed)
      stateRef.set(refreshed)
      refreshed
    }
  }

def registerUserProfile(role: UserRole, displayName: PersonName): Either[ErrorMessage, Option[EntityId]] =
  role match
      case UserRole.customer =>
        val customerId = nextId(new DisplayText("cust"))
        val registrationCoupons = initialRegistrationCoupons(customerId, now())
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                customers =
                  Customer(
                    id = customerId,
                    name = customerAlias(customerId),
                    phone =
                      new PhoneNumber(
                        List(
                          customerPhonePrefix,
                          customerId.raw.filter(_.isDigit).padTo(AuthDefaults.GeneratedIdSuffixLength, NumericDefaults.ZeroDigitChar).mkString.take(AuthDefaults.GeneratedIdSuffixLength),
                        ).mkString
                      ),
                    defaultAddress = pendingAddress,
                    addresses = List(AddressEntry(defaultAddressLabel, pendingAddress)),
                    accountStatus = AccountStatus.Active,
                    revokedReviewCount = NumericDefaults.ZeroCount,
                    membershipTier = MembershipTier.Standard,
                    monthlySpendCents = NumericDefaults.ZeroCurrencyCents,
                    balanceCents = NumericDefaults.ZeroCurrencyCents,
                    coupons = registrationCoupons,
                  ) :: current.customers,
              )
            )
          )
        }.map(_ => Some(customerId))
      case UserRole.rider =>
        val riderId = nextId(RiderIdPrefix)
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                riders =
                  Rider(
                    id = riderId,
                    name = displayName,
                    vehicle = riderVehiclePending,
                    zone = riderZonePending,
                    availability = riderAvailable,
                    averageRating = NumericDefaults.ZeroAverageRating,
                    ratingCount = NumericDefaults.ZeroCount,
                    oneStarRatingCount = NumericDefaults.ZeroCount,
                    earningsCents = NumericDefaults.ZeroCurrencyCents,
                    payoutAccount = None,
                    withdrawnCents = NumericDefaults.ZeroCurrencyCents,
                    availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
                    withdrawalHistory = List.empty,
                  ) :: current.riders,
              )
            )
          )
        }.map(_ => Some(riderId))
      case UserRole.merchant =>
        val merchantProfileId = nextId(MerchantIdPrefix)
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                merchantProfiles =
                  MerchantProfile(
                    id = merchantProfileId,
                    merchantName = displayName,
                    contactPhone = emptyPhoneNumber,
                    payoutAccount = None,
                    settledIncomeCents = NumericDefaults.ZeroCurrencyCents,
                    withdrawnCents = NumericDefaults.ZeroCurrencyCents,
                    availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
                    withdrawalHistory = List.empty,
                  ) :: current.merchantProfiles.filterNot(_.merchantName == displayName),
              )
            )
          )
        }.map(_ => Some(merchantProfileId))
      case UserRole.admin =>
        Left(adminSelfRegistrationMessage)

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
    linkedProfileId.contains(customerId)

def ownsOrderAsCustomer(orderId: OrderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    stateRef.get().orders.exists(order => order.id == orderId && linkedProfileId.contains(order.customerId))

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
      current.merchantProfiles.exists(profile => profile.id == profileId && profile.merchantName == merchantName)
    ) || current.merchantProfiles.exists(_.merchantName == merchantName)

def ownsRiderProfile(riderId: RiderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    linkedProfileId.contains(riderId)

def ownsOrderAsRider(orderId: OrderId, linkedProfileId: Option[EntityId]): ApprovalFlag =
    stateRef.get().orders.exists(order => order.id == orderId && linkedProfileId.contains(order.riderId.getOrElse("")))

def transitionOrder(
      orderId: OrderId,
      expected: OrderStatus,
      next: OrderStatus,
      note: DisplayText,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(order.status == expected, (), orderStatusMismatch(expected))
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                status = next,
                updatedAt = timestamp,
                timeline = entry.timeline :+ OrderTimelineEntry(next, note, timestamp),
              )
            else entry
          )
          withDerivedData(current.copy(orders = nextOrders))
      }
    }

def updateState(
      mutate: DeliveryAppState => Either[ErrorMessage, DeliveryAppState]
  ): Either[ErrorMessage, DeliveryAppState] =
    writeLock.synchronized {
      val current = refreshState(stateRef.get(), now())
      mutate(current).map(next =>
        val refreshed = refreshState(next, now())
        saveState(refreshed)
        stateRef.set(refreshed)
        refreshed
      )
    }

def loadState(): DeliveryAppState =
  loadOrCreateJsonFile(stateFile, seedState())

def saveState(state: DeliveryAppState): Unit =
  writeJsonFile(stateFile, state)

def nextId(prefix: DisplayText): EntityId =
  List(prefix.raw, "-", UUID.randomUUID().toString.take(DeliveryBusinessDefaults.GeneratedIdSuffixLength)).mkString

def now(): IsoDateTime = new IsoDateTime(Instant.now().toString)
