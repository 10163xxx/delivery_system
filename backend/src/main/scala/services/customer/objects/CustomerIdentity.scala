package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class CustomerIdentity(
    id: CustomerId,
    name: PersonName,
    phone: PhoneNumber,
    defaultAddress: AddressText,
    location: Option[CustomerLocation],
    addresses: List[AddressEntry],
    accountStatus: AccountStatus,
)
object CustomerIdentity:
  given Encoder[CustomerIdentity] = deriveEncoder
  given Decoder[CustomerIdentity] = deriveDecoder
