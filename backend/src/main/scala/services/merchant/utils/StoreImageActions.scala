package services.merchant.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.objects.given

import cats.effect.IO
import services.merchant.objects.apiTypes.ImageUploadResponse
import system.objects.{ErrorMessage, FileNameText, MediaTypeText}
import system.uploads.{StoredStoreImage, findStoreImage, saveStoreImage}

def saveMerchantStoreImage(
    originalFilename: Option[FileNameText],
    mediaType: Option[MediaTypeText],
    bytes: Array[Byte],
): IO[Either[ErrorMessage, ImageUploadResponse]] =
  saveStoreImage(originalFilename, mediaType, bytes)

def findMerchantStoreImage(filename: FileNameText): IO[Option[StoredStoreImage]] =
  findStoreImage(filename)
