package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum AfterSalesResolutionMode:
  case Balance, Coupon, Manual

object AfterSalesResolutionMode:
  private val enumLabel = text("AfterSalesResolutionMode")
  def render(value: AfterSalesResolutionMode): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AfterSalesResolutionMode] = parseEnumValue(value, AfterSalesResolutionMode.values)
  given Encoder[AfterSalesResolutionMode] = enumEncoder
  given Decoder[AfterSalesResolutionMode] = enumDecoder(AfterSalesResolutionMode.values, enumLabel)
