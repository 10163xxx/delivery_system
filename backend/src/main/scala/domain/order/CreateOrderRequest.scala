package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class CreateOrderRequest(
    customerId: CustomerId,
    storeId: StoreId,
    deliveryAddress: AddressText,
    scheduledDeliveryAt: IsoDateTime,
    remark: Option[NoteText],
    couponId: Option[CouponId],
    items: List[OrderItemInput],
)
object CreateOrderRequest:
  given Encoder[CreateOrderRequest] = deriveEncoder
  given Decoder[CreateOrderRequest] = deriveDecoder
