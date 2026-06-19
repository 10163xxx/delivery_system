package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class AddressLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AddressLabel:
  given WrappedTextType[AddressLabel] = wrappedTextType(value => new AddressLabel(value), _.value)
