package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class VehicleLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object VehicleLabel:
  given WrappedTextType[VehicleLabel] = wrappedTextType(value => new VehicleLabel(value), _.value)
