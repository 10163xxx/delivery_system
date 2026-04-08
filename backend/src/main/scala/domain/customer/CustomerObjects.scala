package domain.customer

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.{AccountStatus, MembershipTier}

final case class AddressEntry(label: String, address: String)
object AddressEntry:
  given Encoder[AddressEntry] = deriveEncoder
  given Decoder[AddressEntry] = deriveDecoder

final case class Coupon(
    id: String,
    title: String,
    discountCents: Int,
    minimumSpendCents: Int,
    description: String,
    expiresAt: String,
)
object Coupon:
  given Encoder[Coupon] = deriveEncoder
  given Decoder[Coupon] = deriveDecoder

final case class Customer(
    id: String,
    name: String,
    phone: String,
    defaultAddress: String,
    addresses: List[AddressEntry],
    accountStatus: AccountStatus,
    revokedReviewCount: Int,
    membershipTier: MembershipTier,
    monthlySpendCents: Int,
    balanceCents: Int,
    coupons: List[Coupon],
)
object Customer:
  given Encoder[Customer] = deriveEncoder
  given Decoder[Customer] = deriveDecoder

final case class UpdateCustomerProfileRequest(name: String)
object UpdateCustomerProfileRequest:
  given Encoder[UpdateCustomerProfileRequest] = deriveEncoder
  given Decoder[UpdateCustomerProfileRequest] = deriveDecoder

final case class AddCustomerAddressRequest(label: String, address: String)
object AddCustomerAddressRequest:
  given Encoder[AddCustomerAddressRequest] = deriveEncoder
  given Decoder[AddCustomerAddressRequest] = deriveDecoder

final case class RemoveCustomerAddressRequest(address: String)
object RemoveCustomerAddressRequest:
  given Encoder[RemoveCustomerAddressRequest] = deriveEncoder
  given Decoder[RemoveCustomerAddressRequest] = deriveDecoder

final case class SetDefaultCustomerAddressRequest(address: String)
object SetDefaultCustomerAddressRequest:
  given Encoder[SetDefaultCustomerAddressRequest] = deriveEncoder
  given Decoder[SetDefaultCustomerAddressRequest] = deriveDecoder

final case class RechargeBalanceRequest(amountCents: Int)
object RechargeBalanceRequest:
  given Encoder[RechargeBalanceRequest] = deriveEncoder
  given Decoder[RechargeBalanceRequest] = deriveDecoder
