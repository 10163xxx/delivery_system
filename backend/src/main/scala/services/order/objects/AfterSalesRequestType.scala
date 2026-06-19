package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum AfterSalesRequestType:
  case ReturnRequest, CompensationRequest

object AfterSalesRequestType:
  private val enumLabel = text("AfterSalesRequestType")
  def render(value: AfterSalesRequestType): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[AfterSalesRequestType] = parseEnumValue(value, AfterSalesRequestType.values)
  given Encoder[AfterSalesRequestType] = enumEncoder
  given Decoder[AfterSalesRequestType] = enumDecoder(AfterSalesRequestType.values, enumLabel)
