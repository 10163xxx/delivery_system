package system.objects

import system.objects.given


final class DatabaseName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object DatabaseName:
  given WrappedTextType[DatabaseName] = wrappedTextType(value => new DatabaseName(value), _.value)
