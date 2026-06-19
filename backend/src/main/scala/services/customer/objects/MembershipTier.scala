package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*

import io.circe.{Decoder, Encoder}

enum MembershipTier:
  case Standard, Member

object MembershipTier:
  private val enumLabel = text("MembershipTier")
  def render(value: MembershipTier): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[MembershipTier] = parseEnumValue(value, MembershipTier.values)
  given Encoder[MembershipTier] = enumEncoder
  given Decoder[MembershipTier] = enumDecoder(MembershipTier.values, enumLabel)
