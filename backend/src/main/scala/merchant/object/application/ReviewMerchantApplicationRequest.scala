package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class ReviewMerchantApplicationRequest(reviewNote: ResolutionText)
object ReviewMerchantApplicationRequest:
  given Encoder[ReviewMerchantApplicationRequest] = deriveEncoder
  given Decoder[ReviewMerchantApplicationRequest] = deriveDecoder
