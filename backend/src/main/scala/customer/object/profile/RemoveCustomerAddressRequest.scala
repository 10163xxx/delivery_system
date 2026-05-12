package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class RemoveCustomerAddressRequest(address: AddressText)
object RemoveCustomerAddressRequest:
  given Encoder[RemoveCustomerAddressRequest] = deriveEncoder
  given Decoder[RemoveCustomerAddressRequest] = deriveDecoder
