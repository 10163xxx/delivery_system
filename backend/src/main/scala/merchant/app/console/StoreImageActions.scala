package merchant.app

import domain.shared.given

import cats.effect.IO
import domain.merchant.ImageUploadResponse
import domain.shared.{ErrorMessage, FileNameText, MediaTypeText}
import shared.infra.uploads.{resolveStoreImagePath, saveStoreImage}

import java.nio.file.Path

def saveMerchantStoreImage(
    originalFilename: Option[FileNameText],
    mediaType: Option[MediaTypeText],
    bytes: Array[Byte],
): IO[Either[ErrorMessage, ImageUploadResponse]] =
  saveStoreImage(originalFilename, mediaType, bytes)

def resolveMerchantStoreImagePath(filename: FileNameText): Option[Path] =
  resolveStoreImagePath(filename)
