package domain.customer

import domain.shared.given

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*
import domain.shared.*

final case class UpdateCustomerProfileRequest(name: PersonName)
object UpdateCustomerProfileRequest:
  given Encoder[UpdateCustomerProfileRequest] = deriveEncoder
  given Decoder[UpdateCustomerProfileRequest] = deriveDecoder
