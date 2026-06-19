package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class OrderTimelineEntry(status: OrderStatus, note: DisplayText, at: IsoDateTime)
object OrderTimelineEntry:
  given Encoder[OrderTimelineEntry] = deriveEncoder
  given Decoder[OrderTimelineEntry] = deriveDecoder
