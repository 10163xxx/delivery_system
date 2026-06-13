package domain.shared

import domain.shared.given

import io.circe.{Decoder, Encoder}

enum MembershipTier:
  case Standard, Member

object MembershipTier:
  private val enumLabel = text("MembershipTier")
  def render(value: MembershipTier): DisplayText = enumDisplayText(value)
  def parse(value: DisplayText): Option[MembershipTier] = parseEnumValue(value, MembershipTier.values)
  given Encoder[MembershipTier] = enumEncoder
  given Decoder[MembershipTier] = enumDecoder(MembershipTier.values, enumLabel)
