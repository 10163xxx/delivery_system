package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class Customer(
    identity: CustomerIdentity,
    metrics: CustomerMetrics,
)

object Customer:
  extension (customer: Customer)
    def id: CustomerId = customer.identity.id
    def name: PersonName = customer.identity.name
    def phone: PhoneNumber = customer.identity.phone
    def defaultAddress: AddressText = customer.identity.defaultAddress
    def location: Option[CustomerLocation] = customer.identity.location
    def addresses: List[AddressEntry] = customer.identity.addresses
    def accountStatus: AccountStatus = customer.identity.accountStatus
    def revokedReviewCount: EntityCount = customer.metrics.revokedReviewCount
    def membershipTier: MembershipTier = customer.metrics.membershipTier
    def monthlySpendCents: CurrencyCents = customer.metrics.monthlySpendCents
    def balanceCents: CurrencyCents = customer.metrics.balanceCents
    def coupons: List[Coupon] = customer.metrics.coupons

  given Encoder[Customer] = Encoder.instance(customer =>
    deriveEncoder[Customer]
      .apply(customer)
      .deepMerge(
        deriveEncoder[CustomerIdentity]
          .apply(customer.identity)
      )
      .deepMerge(
        deriveEncoder[CustomerMetrics]
          .apply(customer.metrics)
      )
      .mapObject(_.remove("identity").remove("metrics"))
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
      identity = CustomerIdentity(
        id = id,
        name = name,
        phone = phone,
        defaultAddress = defaultAddress,
        location = location,
        addresses = addresses,
        accountStatus = accountStatus,
      ),
      metrics = CustomerMetrics(
        revokedReviewCount = revokedReviewCount,
        membershipTier = membershipTier,
        monthlySpendCents = monthlySpendCents,
        balanceCents = balanceCents,
        coupons = coupons,
      ),
    )
  }
