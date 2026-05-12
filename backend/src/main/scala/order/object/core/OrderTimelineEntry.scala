package domain.order

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class OrderTimelineEntry(status: OrderStatus, note: DisplayText, at: IsoDateTime)
object OrderTimelineEntry:
  given Encoder[OrderTimelineEntry] = deriveEncoder
  given Decoder[OrderTimelineEntry] = deriveDecoder
