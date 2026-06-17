package domain.review

import domain.shared.given

import domain.shared.*
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
