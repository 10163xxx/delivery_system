package shared.app

import domain.shared.given

import domain.customer.*
import domain.merchant.*
import domain.rider.*
import domain.shared.*

private val seededStoreOpen = StoreOpenStatus
private val seededRiderAvailable = RiderAvailableStatus

def text(value: String): DisplayText = new DisplayText(value)
def description(value: String): DescriptionText = new DescriptionText(value)
def image(value: String): ImageUrl = new ImageUrl(value)
def person(value: String): PersonName = new PersonName(value)
def phone(value: String): PhoneNumber = new PhoneNumber(value)
def address(value: String): AddressText = new AddressText(value)
def label(value: String): AddressLabel = new AddressLabel(value)
def time(value: String): TimeOfDay = new TimeOfDay(value)
def vehicle(value: String): VehicleLabel = new VehicleLabel(value)
def zone(value: String): ZoneLabel = new ZoneLabel(value)

def seedMenuItem(
      id: MenuItemId,
      name: DisplayText,
      description: DescriptionText,
      priceCents: CurrencyCents,
      imageUrl: ImageUrl,
      remainingQuantity: Option[Quantity] = None,
  ): MenuItem =
    MenuItem(
      id = id,
      name = name,
      description = description,
      priceCents = priceCents,
      imageUrl = Some(imageUrl),
      remainingQuantity = remainingQuantity,
    )

def seedStore(
      id: StoreId,
      merchantName: PersonName,
      name: DisplayText,
      category: DisplayText,
      businessHours: BusinessHours,
      avgPrepMinutes: Minutes,
      imageUrl: ImageUrl,
      menu: List[MenuItem],
      revenueCents: CurrencyCents = NumericDefaults.ZeroCurrencyCents,
  ): Store =
    Store(
      id = id,
      merchantName = merchantName,
      name = name,
      category = category,
      cuisine = new CuisineLabel(category.raw),
      status = seededStoreOpen,
      businessHours = businessHours,
      avgPrepMinutes = avgPrepMinutes,
      imageUrl = Some(imageUrl),
      menu = menu,
      averageRating = NumericDefaults.ZeroAverageRating,
      ratingCount = NumericDefaults.ZeroCount,
      oneStarRatingCount = NumericDefaults.ZeroCount,
      revenueCents = revenueCents,
    )

def seedCustomer(
      id: CustomerId,
      phone: PhoneNumber,
      defaultAddress: AddressText,
      addresses: List[AddressEntry],
      balanceCents: CurrencyCents,
  ): Customer =
    Customer(
      id = id,
      name = customerAlias(id),
      phone = phone,
      defaultAddress = defaultAddress,
      addresses = addresses,
      accountStatus = AccountStatus.Active,
      revokedReviewCount = NumericDefaults.ZeroCount,
      membershipTier = MembershipTier.Standard,
      monthlySpendCents = NumericDefaults.ZeroCurrencyCents,
      balanceCents = balanceCents,
      coupons = List.empty,
    )

def seedRider(
      id: RiderId,
      name: PersonName,
      vehicle: VehicleLabel,
      zone: ZoneLabel,
  ): Rider =
    Rider(
      id = id,
      name = name,
      vehicle = vehicle,
      zone = zone,
      availability = seededRiderAvailable,
      averageRating = NumericDefaults.ZeroAverageRating,
      ratingCount = NumericDefaults.ZeroCount,
      oneStarRatingCount = NumericDefaults.ZeroCount,
      earningsCents = NumericDefaults.ZeroCurrencyCents,
      payoutAccount = None,
      withdrawnCents = NumericDefaults.ZeroCurrencyCents,
      availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
      withdrawalHistory = List.empty,
    )

def seedMerchantProfile(
      id: MerchantId,
      merchantName: PersonName,
      contactPhone: PhoneNumber,
      payoutAccount: Option[MerchantPayoutAccount],
  ): MerchantProfile =
    MerchantProfile(
      id = id,
      merchantName = merchantName,
      contactPhone = contactPhone,
      payoutAccount = payoutAccount,
      settledIncomeCents = NumericDefaults.ZeroCurrencyCents,
      withdrawnCents = NumericDefaults.ZeroCurrencyCents,
      availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
      withdrawalHistory = List.empty,
    )
