package services.merchant.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given
import system.objects.*


final class AccountHolderName(val value: String) extends AnyVal:
  override def toString: String = value
  def raw: String = value
object AccountHolderName:
  given WrappedTextType[AccountHolderName] = wrappedTextType(value => new AccountHolderName(value), _.value)
