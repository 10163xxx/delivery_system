package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class AvailabilityLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AvailabilityLabel:
  given WrappedTextType[AvailabilityLabel] = wrappedTextType(value => new AvailabilityLabel(value), _.value)
