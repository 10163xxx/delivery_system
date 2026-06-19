package system.objects

import system.objects.given


final class TimeOfDay(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object TimeOfDay:
  given WrappedTextType[TimeOfDay] = wrappedTextType(value => new TimeOfDay(value), _.value)
