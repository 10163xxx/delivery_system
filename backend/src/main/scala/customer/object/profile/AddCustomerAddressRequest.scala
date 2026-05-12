package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AddCustomerAddressRequest(label: AddressLabel, address: AddressText)
object AddCustomerAddressRequest:
  given Encoder[AddCustomerAddressRequest] = deriveEncoder
  given Decoder[AddCustomerAddressRequest] = deriveDecoder
