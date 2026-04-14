package app.delivery

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.rider.*
import domain.shared.*
import infra.files.{loadOrCreateJsonFile, writeJsonFile}

import java.time.{Instant, ZoneId}
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

private[delivery] val OneStarRevocationThreshold = DeliveryBusinessDefaults.OneStarRevocationThreshold
private[delivery] val CustomerBanThreshold = DeliveryBusinessDefaults.CustomerBanThreshold
private[delivery] val MemberMonthlySpendThresholdCents = DeliveryBusinessDefaults.MemberMonthlySpendThresholdCents
private[delivery] val StandardAutoDispatchMinutes = DeliveryBusinessDefaults.StandardAutoDispatchMinutes
private[delivery] val MemberAutoDispatchMinutes = DeliveryBusinessDefaults.MemberAutoDispatchMinutes
private[delivery] val MonthlyWindowDays = DeliveryBusinessDefaults.MonthlyWindowDays
private[delivery] val ReviewWindowDays = DeliveryBusinessDefaults.ReviewWindowDays
private[delivery] val MinimumScheduledLeadMinutes = DeliveryBusinessDefaults.MinimumScheduledLeadMinutes
private[delivery] val DeliveryFeeCents = DeliveryBusinessDefaults.DeliveryFeeCents
private[delivery] val RiderEarningPerOrderCents = DeliveryBusinessDefaults.RiderEarningPerOrderCents
private[delivery] val MerchantRevenueShareNumerator = DeliveryBusinessDefaults.MerchantRevenueShareNumerator
private[delivery] val MerchantRevenueShareDenominator = DeliveryBusinessDefaults.MerchantRevenueShareDenominator
private[delivery] val StoreOpenStatus = DeliveryBusinessDefaults.StoreOpenStatus
private[delivery] val StoreBusyStatus = DeliveryBusinessDefaults.StoreBusyStatus
private[delivery] val StoreRevokedStatus = DeliveryBusinessDefaults.StoreRevokedStatus
private[delivery] val RiderAvailableStatus = DeliveryBusinessDefaults.RiderAvailableStatus
private[delivery] val RiderOnDeliveryStatus = DeliveryBusinessDefaults.RiderOnDeliveryStatus
private[delivery] val RiderSuspendedStatus = DeliveryBusinessDefaults.RiderSuspendedStatus
private[delivery] val OrderIdPrefix = DeliveryBusinessDefaults.OrderIdPrefix
private[delivery] val MerchantAcceptedTimelineNote = DeliveryBusinessDefaults.MerchantAcceptedTimelineNote
private[delivery] val MerchantPreparedTimelineNote = DeliveryBusinessDefaults.MerchantPreparedTimelineNote
private[delivery] val RiderPickedUpTimelineNote = DeliveryBusinessDefaults.RiderPickedUpTimelineNote
private[delivery] val RiderDeliveredTimelineNote = DeliveryBusinessDefaults.RiderDeliveredTimelineNote
private[delivery] val CouponSpendStepCents = DeliveryBusinessDefaults.CouponSpendStepCents
private[delivery] val CouponValidityDays = DeliveryBusinessDefaults.CouponValidityDays
private[delivery] val MemberTierCouponValidityDays = DeliveryBusinessDefaults.MemberTierCouponValidityDays
private[delivery] val WelcomeCouponCount = DeliveryBusinessDefaults.WelcomeCouponCount
private[delivery] val WelcomeCouponTemplate = DeliveryBusinessDefaults.WelcomeCouponTemplate
private[delivery] val MemberTierCouponTemplate = DeliveryBusinessDefaults.MemberTierCouponTemplate
private[delivery] val MerchantIdPrefix = DeliveryBusinessDefaults.MerchantIdPrefix
private[delivery] val RiderIdPrefix = DeliveryBusinessDefaults.RiderIdPrefix
private[delivery] val DeliveryScheduleZone = ZoneId.systemDefault()
private[delivery] val StoreCategories = List(
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
private[delivery] val SpendRewardCouponTemplates = DeliveryBusinessDefaults.SpendRewardCouponTemplates
private val pendingAddress = new AddressText("请先完善默认地址")
private val defaultAddressLabel = new AddressLabel("默认")
private val riderVehiclePending = new VehicleLabel("待完善")
private val riderZonePending = new ZoneLabel("待分区")
private val riderAvailable = RiderAvailableStatus
private val emptyPhoneNumber = new PhoneNumber("")
private val adminSelfRegistrationMessage = new ErrorMessage("管理员账号不能自助注册")
private val userAliasPrefix = new DisplayText("用户")
private val customerPhonePrefix = "139"

private[delivery] val stateFile = sys.env
  .get(DeliveryRuntimeDefaults.StateFileEnv.raw)
  .map(java.nio.file.Paths.get(_))
  .getOrElse(DeliveryRuntimeDefaults.StateFilePath)
private[delivery] val writeLock = new AnyRef
private[delivery] val stateRef = new AtomicReference[DeliveryAppState](loadState())

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

private[delivery] def transitionOrder(
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

private[delivery] def updateState(
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

private[delivery] def loadState(): DeliveryAppState =
  loadOrCreateJsonFile(stateFile, seedState())

private[delivery] def saveState(state: DeliveryAppState): Unit =
  writeJsonFile(stateFile, state)

private[delivery] def nextId(prefix: DisplayText): EntityId =
  List(prefix.raw, "-", UUID.randomUUID().toString.take(DeliveryBusinessDefaults.GeneratedIdSuffixLength)).mkString

private[delivery] def now(): IsoDateTime = new IsoDateTime(Instant.now().toString)
