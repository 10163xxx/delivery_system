package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum OrderStatus:
  case PendingMerchantAcceptance, Preparing, ReadyForPickup, Delivering, Completed, Cancelled, Escalated

object OrderStatus:
  private val enumLabel = text("OrderStatus")
  def render(value: OrderStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[OrderStatus] = parseEnumValue(value, OrderStatus.values)
  given Encoder[OrderStatus] = enumEncoder
  given Decoder[OrderStatus] = enumDecoder(OrderStatus.values, enumLabel)
