package services.merchant.utils

import domain.shared.given

import cats.effect.IO
import domain.merchant.ImageUploadResponse
import domain.shared.{ErrorMessage, FileNameText, MediaTypeText}
import system.uploads.{StoredStoreImage, findStoreImage, saveStoreImage}

def saveMerchantStoreImage(
    originalFilename: Option[FileNameText],
    mediaType: Option[MediaTypeText],
    bytes: Array[Byte],
): IO[Either[ErrorMessage, ImageUploadResponse]] =
  saveStoreImage(originalFilename, mediaType, bytes)

def findMerchantStoreImage(filename: FileNameText): IO[Option[StoredStoreImage]] =
  findStoreImage(filename)
