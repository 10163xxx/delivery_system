package services.rider.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class ZoneLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object ZoneLabel:
  given WrappedTextType[ZoneLabel] = wrappedTextType(value => new ZoneLabel(value), _.value)
