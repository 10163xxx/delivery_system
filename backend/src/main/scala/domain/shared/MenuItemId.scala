package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class MenuItemId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object MenuItemId:
  given WrappedTextType[MenuItemId] = wrappedTextType(value => new MenuItemId(value), _.value)
  given Conversion[String, MenuItemId] = value => new MenuItemId(value)
  given Conversion[MenuItemId, EntityId] = value => new EntityId(value.value)
