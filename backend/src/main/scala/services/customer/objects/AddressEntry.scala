package services.customer.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import system.objects.*

final case class AddressEntry(
    label: AddressLabel,
    address: AddressText,
    location: Option[CustomerLocation],
)
object AddressEntry:
  given Encoder[AddressEntry] = deriveEncoder
  given Decoder[AddressEntry] = deriveDecoder
