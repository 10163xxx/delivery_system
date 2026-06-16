package domain.customer

import domain.shared.given

import domain.shared.*
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
