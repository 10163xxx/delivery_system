package services.customer.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.customer.objects.*

import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class AddCustomerAddressRequest(
    label: AddressLabel,
    address: AddressText,
    location: CustomerLocation,
)
object AddCustomerAddressRequest:
  given Encoder[AddCustomerAddressRequest] = deriveEncoder
  given Decoder[AddCustomerAddressRequest] = deriveDecoder
