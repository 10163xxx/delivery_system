package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class AddressText(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AddressText:
  given WrappedTextType[AddressText] = wrappedTextType(value => new AddressText(value), _.value)
