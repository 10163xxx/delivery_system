package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class CustomerMetrics(
    revokedReviewCount: EntityCount,
    membershipTier: MembershipTier,
    monthlySpendCents: CurrencyCents,
    balanceCents: CurrencyCents,
    coupons: List[Coupon],
)

final case class Customer(
    id: CustomerId,
    name: PersonName,
    phone: PhoneNumber,
    defaultAddress: AddressText,
    location: Option[CustomerLocation],
    addresses: List[AddressEntry],
    accountStatus: AccountStatus,
    metrics: CustomerMetrics,
)

final case class CustomerLocation(
    latitude: Latitude,
    longitude: Longitude,
)
object CustomerLocation:
  given Encoder[CustomerLocation] = deriveEncoder
  given Decoder[CustomerLocation] = deriveDecoder

object Customer:
  given Encoder[CustomerMetrics] = deriveEncoder
  given Decoder[CustomerMetrics] = deriveDecoder

  def apply(
      id: CustomerId,
      name: PersonName,
      phone: PhoneNumber,
      defaultAddress: AddressText,
      location: Option[CustomerLocation],
      addresses: List[AddressEntry],
      accountStatus: AccountStatus,
      revokedReviewCount: EntityCount,
      membershipTier: MembershipTier,
      monthlySpendCents: CurrencyCents,
      balanceCents: CurrencyCents,
      coupons: List[Coupon],
  ): Customer =
    new Customer(
      id = id,
      name = name,
      phone = phone,
      defaultAddress = defaultAddress,
      location = location,
      addresses = addresses,
      accountStatus = accountStatus,
      metrics = CustomerMetrics(
        revokedReviewCount = revokedReviewCount,
        membershipTier = membershipTier,
        monthlySpendCents = monthlySpendCents,
        balanceCents = balanceCents,
        coupons = coupons,
      ),
    )

  extension (customer: Customer)
    def revokedReviewCount: EntityCount = customer.metrics.revokedReviewCount
    def membershipTier: MembershipTier = customer.metrics.membershipTier
    def monthlySpendCents: CurrencyCents = customer.metrics.monthlySpendCents
    def balanceCents: CurrencyCents = customer.metrics.balanceCents
    def coupons: List[Coupon] = customer.metrics.coupons

  given Encoder[Customer] = Encoder.instance(customer =>
    deriveEncoder[Customer]
      .apply(customer)
      .deepMerge(
        deriveEncoder[CustomerMetrics]
          .apply(customer.metrics)
      )
      .mapObject(_.remove("metrics"))
  )

  given Decoder[Customer] = Decoder.instance { cursor =>
    for
      id <- cursor.get[CustomerId]("id")
      name <- cursor.get[PersonName]("name")
      phone <- cursor.get[PhoneNumber]("phone")
      defaultAddress <- cursor.get[AddressText]("defaultAddress")
      location <- cursor.get[Option[CustomerLocation]]("location")
      addresses <- cursor.get[List[AddressEntry]]("addresses")
      accountStatus <- cursor.get[AccountStatus]("accountStatus")
      revokedReviewCount <- cursor.get[EntityCount]("revokedReviewCount")
      membershipTier <- cursor.get[MembershipTier]("membershipTier")
      monthlySpendCents <- cursor.get[CurrencyCents]("monthlySpendCents")
      balanceCents <- cursor.get[CurrencyCents]("balanceCents")
      coupons <- cursor.get[List[Coupon]]("coupons")
    yield Customer(
      id = id,
      name = name,
      phone = phone,
      defaultAddress = defaultAddress,
      location = location,
      addresses = addresses,
      accountStatus = accountStatus,
      revokedReviewCount = revokedReviewCount,
      membershipTier = membershipTier,
      monthlySpendCents = monthlySpendCents,
      balanceCents = balanceCents,
      coupons = coupons,
    )
  }
