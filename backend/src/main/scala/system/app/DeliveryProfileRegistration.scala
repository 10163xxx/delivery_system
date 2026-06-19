package system.app

// Business note: application-level business orchestration and derived state shared by service actions.
import system.objects.given
import services.auth.objects.*

import services.customer.objects.*
import services.merchant.objects.*
import services.rider.objects.*
import system.objects.*

private val pendingAddress = DeliveryDefaultCustomerAddress
private val defaultAddressLabel = new AddressLabel("默认")
private val riderVehiclePending = new VehicleLabel("待完善")
private val riderZonePending = new ZoneLabel("待分区")
private val riderAvailable = RiderAvailableStatus
private val emptyPhoneNumber = new PhoneNumber("")
private val adminSelfRegistrationMessage = new ErrorMessage("管理员账号不能自助注册")
private val userAliasPrefix = new DisplayText("用户")
private val customerPhonePrefix = "139"

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
      identity = CustomerIdentity(
        id = customerId,
        name = customerAlias(customerId),
        phone = generatedCustomerPhone(customerId),
        defaultAddress = pendingAddress,
        location = None,
        addresses = List(AddressEntry(defaultAddressLabel, pendingAddress, None)),
        accountStatus = AccountStatus.Active,
      ),
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
      identity = RiderIdentity(
        id = riderId,
        name = displayName,
        vehicle = riderVehiclePending,
        zone = riderZonePending,
        availability = riderAvailable,
      ),
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
