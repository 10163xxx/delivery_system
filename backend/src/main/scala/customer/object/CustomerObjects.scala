package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AddressEntry(label: AddressLabel, address: AddressText)
object AddressEntry:
  given Encoder[AddressEntry] = deriveEncoder
  given Decoder[AddressEntry] = deriveDecoder

final case class Coupon(
    id: CouponId,
    title: DisplayText,
    discountCents: CurrencyCents,
    minimumSpendCents: CurrencyCents,
    description: DescriptionText,
    expiresAt: IsoDateTime,
)
object Coupon:
  given Encoder[Coupon] = deriveEncoder
  given Decoder[Coupon] = deriveDecoder

final case class Customer(
    id: CustomerId,
    name: PersonName,
    phone: PhoneNumber,
    defaultAddress: AddressText,
    addresses: List[AddressEntry],
    accountStatus: AccountStatus,
    revokedReviewCount: EntityCount,
    membershipTier: MembershipTier,
    monthlySpendCents: CurrencyCents,
    balanceCents: CurrencyCents,
    coupons: List[Coupon],
)
object Customer:
  given Encoder[Customer] = deriveEncoder
  given Decoder[Customer] = deriveDecoder

final case class UpdateCustomerProfileRequest(name: PersonName)
object UpdateCustomerProfileRequest:
  given Encoder[UpdateCustomerProfileRequest] = deriveEncoder
  given Decoder[UpdateCustomerProfileRequest] = deriveDecoder

final case class AddCustomerAddressRequest(label: AddressLabel, address: AddressText)
object AddCustomerAddressRequest:
  given Encoder[AddCustomerAddressRequest] = deriveEncoder
  given Decoder[AddCustomerAddressRequest] = deriveDecoder

final case class RemoveCustomerAddressRequest(address: AddressText)
object RemoveCustomerAddressRequest:
  given Encoder[RemoveCustomerAddressRequest] = deriveEncoder
  given Decoder[RemoveCustomerAddressRequest] = deriveDecoder

final case class SetDefaultCustomerAddressRequest(address: AddressText)
object SetDefaultCustomerAddressRequest:
  given Encoder[SetDefaultCustomerAddressRequest] = deriveEncoder
  given Decoder[SetDefaultCustomerAddressRequest] = deriveDecoder

final case class RechargeBalanceRequest(amountCents: CurrencyCents)
object RechargeBalanceRequest:
  given Encoder[RechargeBalanceRequest] = deriveEncoder
  given Decoder[RechargeBalanceRequest] = deriveDecoder
