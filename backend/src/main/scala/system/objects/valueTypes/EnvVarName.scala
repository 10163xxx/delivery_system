package system.objects

import system.objects.given


final class EnvVarName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object EnvVarName:
  given WrappedTextType[EnvVarName] = wrappedTextType(value => new EnvVarName(value), _.value)
