package system.objects

import system.objects.given


final class PersonName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object PersonName:
  given WrappedTextType[PersonName] = wrappedTextType(value => new PersonName(value), _.value)
