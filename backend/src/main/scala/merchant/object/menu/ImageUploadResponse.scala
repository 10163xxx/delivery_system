package domain.merchant

import domain.shared.given

import domain.shared.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class ImageUploadResponse(url: ExternalUrl)
object ImageUploadResponse:
  given Encoder[ImageUploadResponse] = deriveEncoder
  given Decoder[ImageUploadResponse] = deriveDecoder
