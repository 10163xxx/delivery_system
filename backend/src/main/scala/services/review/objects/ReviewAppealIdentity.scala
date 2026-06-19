package services.review.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import services.rider.objects.*
import services.order.objects.*
import services.merchant.objects.*
import services.customer.objects.*

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class ReviewAppealIdentity(
    id: ReviewAppealId,
    orderId: OrderId,
    customerId: CustomerId,
    customerName: PersonName,
    storeId: StoreId,
    riderId: Option[RiderId],
)
object ReviewAppealIdentity:
  given Encoder[ReviewAppealIdentity] = deriveEncoder
  given Decoder[ReviewAppealIdentity] = deriveDecoder
