package domain.shared

import domain.shared.given

import scala.language.implicitConversions

final class DatabaseName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DatabaseName:
  given WrappedTextType[DatabaseName] = wrappedTextType(value => new DatabaseName(value), _.value)
