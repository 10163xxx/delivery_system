package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class CustomerId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object CustomerId:
  given WrappedTextType[CustomerId] = wrappedTextType(value => new CustomerId(value), _.value)
  given Conversion[String, CustomerId] = value => new CustomerId(value)
  given Conversion[CustomerId, EntityId] = value => new EntityId(value.value)
