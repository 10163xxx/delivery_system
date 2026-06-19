package services.order.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.order.objects.*

import system.objects.given
import services.merchant.objects.*
import services.customer.objects.*

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

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
