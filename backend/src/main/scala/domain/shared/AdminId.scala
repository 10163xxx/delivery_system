package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class AdminId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AdminId:
  given WrappedTextType[AdminId] = wrappedTextType(value => new AdminId(value), _.value)
  given Conversion[String, AdminId] = value => new AdminId(value)
  given Conversion[AdminId, EntityId] = value => new EntityId(value.value)
