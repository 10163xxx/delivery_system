package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

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
