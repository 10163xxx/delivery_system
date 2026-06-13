package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class RiderId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object RiderId:
  given WrappedTextType[RiderId] = wrappedTextType(value => new RiderId(value), _.value)
  given Conversion[String, RiderId] = value => new RiderId(value)
  given Conversion[RiderId, EntityId] = value => new EntityId(value.value)
