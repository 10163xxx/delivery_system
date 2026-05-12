package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class SetDefaultCustomerAddressRequest(address: AddressText)
object SetDefaultCustomerAddressRequest:
  given Encoder[SetDefaultCustomerAddressRequest] = deriveEncoder
  given Decoder[SetDefaultCustomerAddressRequest] = deriveDecoder
