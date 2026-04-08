package app.delivery

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.rider.*
import domain.shared.*
import infra.files.{loadOrCreateJsonFile, writeJsonFile}

import java.nio.file.Paths
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
private[delivery] val CouponSpendStepCents = DeliveryBusinessDefaults.CouponSpendStepCents
private[delivery] val CouponValidityDays = DeliveryBusinessDefaults.CouponValidityDays
private[delivery] val MemberTierCouponValidityDays = DeliveryBusinessDefaults.MemberTierCouponValidityDays
private[delivery] val WelcomeCouponCount = DeliveryBusinessDefaults.WelcomeCouponCount
private[delivery] val WelcomeCouponTemplate = DeliveryBusinessDefaults.WelcomeCouponTemplate
private[delivery] val MemberTierCouponTemplate = DeliveryBusinessDefaults.MemberTierCouponTemplate
private[delivery] val DeliveryScheduleZone = ZoneId.systemDefault()
private[delivery] val StoreCategories = List(
  "中式快餐",
  "盖饭简餐",
  "面馆粉档",
  "麻辣香锅",
  "饺子馄饨",
  "轻食沙拉",
  "咖啡甜点",
  "奶茶果饮",
  "夜宵小吃",
)
private[delivery] val SpendRewardCouponTemplates = DeliveryBusinessDefaults.SpendRewardCouponTemplates

private[delivery] val stateFile = Paths.get(sys.env.getOrElse("DELIVERY_STATE_FILE", "data/delivery-state.json"))
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

def registerUserProfile(role: UserRole, displayName: String): Either[String, Option[String]] =
  role match
      case UserRole.customer =>
        val customerId = nextId("cust")
        val registrationCoupons = initialRegistrationCoupons(customerId, now())
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                customers =
                  Customer(
                    id = customerId,
                    name = customerAlias(customerId),
                    phone = s"139${customerId.filter(_.isDigit).padTo(AuthDefaults.GeneratedIdSuffixLength, '0').mkString.take(AuthDefaults.GeneratedIdSuffixLength)}",
                    defaultAddress = "请先完善默认地址",
                    addresses = List(AddressEntry("默认", "请先完善默认地址")),
                    accountStatus = AccountStatus.Active,
                    revokedReviewCount = 0,
                    membershipTier = MembershipTier.Standard,
                    monthlySpendCents = 0,
                    balanceCents = 0,
                    coupons = registrationCoupons,
                  ) :: current.customers,
              )
            )
          )
        }.map(_ => Some(customerId))
      case UserRole.rider =>
        val riderId = nextId("rider")
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                riders =
                  Rider(
                    id = riderId,
                    name = displayName,
                    vehicle = "待完善",
                    zone = "待分区",
                    availability = "Available",
                    averageRating = 0.0,
                    ratingCount = 0,
                    oneStarRatingCount = 0,
                    earningsCents = 0,
                    payoutAccount = None,
                    withdrawnCents = 0,
                    availableToWithdrawCents = 0,
                    withdrawalHistory = List.empty,
                  ) :: current.riders,
              )
            )
          )
        }.map(_ => Some(riderId))
      case UserRole.merchant =>
        val merchantProfileId = nextId("merchant")
        updateState { current =>
          Right(
            withDerivedData(
              current.copy(
                merchantProfiles =
                  MerchantProfile(
                    id = merchantProfileId,
                    merchantName = displayName,
                    contactPhone = "",
                    payoutAccount = None,
                    settledIncomeCents = 0,
                    withdrawnCents = 0,
                    availableToWithdrawCents = 0,
                    withdrawalHistory = List.empty,
                  ) :: current.merchantProfiles.filterNot(_.merchantName == displayName),
              )
            )
          )
        }.map(_ => Some(merchantProfileId))
      case UserRole.admin =>
        Left("管理员账号不能自助注册")

def customerAlias(customerId: String): String =
    val digits = customerId.filter(_.isDigit)
    val suffix =
      if digits.nonEmpty then
        digits
          .takeRight(DeliveryBusinessDefaults.CustomerAliasLength)
          .reverse
          .padTo(DeliveryBusinessDefaults.CustomerAliasLength, '0')
          .reverse
          .mkString
      else "0" * DeliveryBusinessDefaults.CustomerAliasLength
    s"用户$suffix"

def ownsCustomer(customerId: String, linkedProfileId: Option[String]): Boolean =
    linkedProfileId.contains(customerId)

def ownsOrderAsCustomer(orderId: String, linkedProfileId: Option[String]): Boolean =
    stateRef.get().orders.exists(order => order.id == orderId && linkedProfileId.contains(order.customerId))

def ownsStore(storeId: String, merchantName: String): Boolean =
    stateRef.get().stores.exists(store => store.id == storeId && store.merchantName == merchantName)

def ownsOrderAsMerchant(orderId: String, merchantName: String): Boolean =
    val current = stateRef.get()
    current.orders.exists(order =>
      order.id == orderId && current.stores.exists(store => store.id == order.storeId && store.merchantName == merchantName)
    )

def ownsMerchantApplication(applicationId: String, merchantName: String): Boolean =
    stateRef.get().merchantApplications.exists(application =>
      application.id == applicationId && application.merchantName == merchantName
    )

def ownsMerchantProfile(merchantName: String, linkedProfileId: Option[String]): Boolean =
    val current = stateRef.get()
    linkedProfileId.exists(profileId =>
      current.merchantProfiles.exists(profile => profile.id == profileId && profile.merchantName == merchantName)
    ) || current.merchantProfiles.exists(_.merchantName == merchantName)

def ownsRiderProfile(riderId: String, linkedProfileId: Option[String]): Boolean =
    linkedProfileId.contains(riderId)

def ownsOrderAsRider(orderId: String, linkedProfileId: Option[String]): Boolean =
    stateRef.get().orders.exists(order => order.id == orderId && linkedProfileId.contains(order.riderId.getOrElse("")))

private[delivery] def transitionOrder(
      orderId: String,
      expected: OrderStatus,
      next: OrderStatus,
      note: String,
  ): IO[Either[String, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)
          _ <- Either.cond(order.status == expected, (), ValidationMessages.orderStatusMismatch(expected))
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
      mutate: DeliveryAppState => Either[String, DeliveryAppState]
  ): Either[String, DeliveryAppState] =
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

private[delivery] def nextId(prefix: String): String =
  s"$prefix-${UUID.randomUUID().toString.take(DeliveryBusinessDefaults.GeneratedIdSuffixLength)}"

private[delivery] def now(): String = Instant.now().toString
