package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class BankName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object BankName:
  given WrappedTextType[BankName] = wrappedTextType(value => new BankName(value), _.value)
