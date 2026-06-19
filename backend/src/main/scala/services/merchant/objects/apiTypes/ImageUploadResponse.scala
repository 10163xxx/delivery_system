package services.merchant.objects.apiTypes

// Business note: protocol DTO shared with the frontend; keep field names and value object types mirrored across stacks.
import services.merchant.objects.*

import system.objects.given

import system.objects.*
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

final case class ImageUploadResponse(url: ImageUrl)
object ImageUploadResponse:
  given Encoder[ImageUploadResponse] = deriveEncoder
  given Decoder[ImageUploadResponse] = deriveDecoder
