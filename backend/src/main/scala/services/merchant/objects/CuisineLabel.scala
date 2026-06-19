package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class CuisineLabel(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object CuisineLabel:
  given WrappedTextType[CuisineLabel] = wrappedTextType(value => new CuisineLabel(value), _.value)
