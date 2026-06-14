package domain.customer

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class CustomerMetrics(
    revokedReviewCount: EntityCount,
    membershipTier: MembershipTier,
    monthlySpendCents: CurrencyCents,
    balanceCents: CurrencyCents,
    coupons: List[Coupon],
)
object CustomerMetrics:
  given Encoder[CustomerMetrics] = deriveEncoder
  given Decoder[CustomerMetrics] = deriveDecoder
