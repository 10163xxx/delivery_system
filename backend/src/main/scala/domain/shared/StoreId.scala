package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class StoreId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object StoreId:
  given WrappedTextType[StoreId] = wrappedTextType(value => new StoreId(value), _.value)
  given Conversion[String, StoreId] = value => new StoreId(value)
  given Conversion[StoreId, EntityId] = value => new EntityId(value.value)
