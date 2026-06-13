package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum OrderStatus:
  case PendingMerchantAcceptance, Preparing, ReadyForPickup, Delivering, Completed, Cancelled, Escalated

object OrderStatus:
  private val enumLabel = text("OrderStatus")
  def render(value: OrderStatus): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[OrderStatus] = parseEnumValue(value, OrderStatus.values)
  given Encoder[OrderStatus] = enumEncoder
  given Decoder[OrderStatus] = enumDecoder(OrderStatus.values, enumLabel)
