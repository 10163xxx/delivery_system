package system.objects

import system.objects.given


final class SqlStatement(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object SqlStatement:
  given WrappedTextType[SqlStatement] = wrappedTextType(value => new SqlStatement(value), _.value)
