package services.rider.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class AvailabilityLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AvailabilityLabel:
  given WrappedTextType[AvailabilityLabel] = wrappedTextType(value => new AvailabilityLabel(value), _.value)
