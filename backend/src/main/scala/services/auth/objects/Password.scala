package services.auth.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class Password(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object Password:
  given WrappedTextType[Password] = wrappedTextType(value => new Password(value), _.value)
