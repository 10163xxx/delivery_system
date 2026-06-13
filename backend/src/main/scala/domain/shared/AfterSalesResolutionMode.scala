package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum AfterSalesResolutionMode:
  case Balance, Coupon, Manual

object AfterSalesResolutionMode:
  private val enumLabel = text("AfterSalesResolutionMode")
  def render(value: AfterSalesResolutionMode): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AfterSalesResolutionMode] = parseEnumValue(value, AfterSalesResolutionMode.values)
  given Encoder[AfterSalesResolutionMode] = enumEncoder
  given Decoder[AfterSalesResolutionMode] = enumDecoder(AfterSalesResolutionMode.values, enumLabel)
