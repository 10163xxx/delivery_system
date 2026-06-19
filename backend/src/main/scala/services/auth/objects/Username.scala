package services.auth.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class Username(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object Username:
  given WrappedTextType[Username] = wrappedTextType(value => new Username(value), _.value)
