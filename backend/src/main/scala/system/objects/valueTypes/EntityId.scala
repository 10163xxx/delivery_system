package system.objects

import system.objects.given


final class EntityId(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object EntityId:
  given WrappedTextType[EntityId] = wrappedTextType(value => new EntityId(value), _.value)

private def textIdType[T](build: String => T, extract: T => String): WrappedTextType[T] =
  wrappedTextType(build, extract)
