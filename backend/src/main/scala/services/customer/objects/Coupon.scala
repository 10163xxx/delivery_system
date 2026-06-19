package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

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
