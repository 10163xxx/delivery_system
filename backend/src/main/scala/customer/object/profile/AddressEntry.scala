package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class AddressEntry(label: AddressLabel, address: AddressText)
object AddressEntry:
  given Encoder[AddressEntry] = deriveEncoder
  given Decoder[AddressEntry] = deriveDecoder
