package infra.uploads

import cats.effect.IO
import domain.merchant.ImageUploadResponse
import domain.shared.UploadDefaults

import java.nio.file.{Files, Path, StandardOpenOption}
import java.util.UUID

private enum SupportedImageType(val mediaType: String, val defaultExtension: String):
  case Jpeg extends SupportedImageType("image/jpeg", "jpg")
  case Png extends SupportedImageType("image/png", "png")
  case Gif extends SupportedImageType("image/gif", "gif")
  case Webp extends SupportedImageType("image/webp", "webp")

private object SupportedImageType:
  private val mediaTypeAliases: Map[String, SupportedImageType] = Map(
    SupportedImageType.Jpeg.mediaType -> SupportedImageType.Jpeg,
    "image/jpg" -> SupportedImageType.Jpeg,
    SupportedImageType.Png.mediaType -> SupportedImageType.Png,
    SupportedImageType.Gif.mediaType -> SupportedImageType.Gif,
    SupportedImageType.Webp.mediaType -> SupportedImageType.Webp,
  )

  def fromMediaType(value: String): Option[SupportedImageType] =
    mediaTypeAliases.get(value.toLowerCase)

def saveStoreImage(
    originalFilename: Option[String],
    mediaType: Option[String],
    bytes: Array[Byte],
): IO[Either[String, ImageUploadResponse]] =
  IO.blocking {
    validateImage(mediaType, bytes).map { imageType =>
      Files.createDirectories(UploadDefaults.UploadRoot)
      val extension = resolveExtension(originalFilename, imageType)
      val generatedName = s"${UUID.randomUUID().toString}.$extension"
      val targetPath = UploadDefaults.UploadRoot.resolve(generatedName).normalize()
      Files.write(
        targetPath,
        bytes,
        StandardOpenOption.CREATE_NEW,
        StandardOpenOption.WRITE,
      )
      ImageUploadResponse(url = s"${UploadDefaults.PublicUrlPrefix}$generatedName")
    }
  }

def resolveStoreImagePath(filename: String): Option[Path] =
  val sanitized = filename.trim
  val candidate = UploadDefaults.UploadRoot.resolve(sanitized).normalize()
  if
    sanitized.nonEmpty &&
    !UploadDefaults.FilenameSeparators.exists(sanitized.contains) &&
    candidate.startsWith(UploadDefaults.UploadRoot.normalize()) &&
    Files.exists(candidate) &&
    Files.isRegularFile(candidate)
  then Some(candidate)
  else None

private def validateImage(
    mediaType: Option[String],
    bytes: Array[Byte],
): Either[String, SupportedImageType] =
  for
    _ <- Either.cond(bytes.nonEmpty, (), UploadDefaults.EmptyUploadMessage)
    _ <- Either.cond(bytes.length <= UploadDefaults.MaxUploadBytes, (), UploadDefaults.OversizedUploadMessage)
    detectedMediaType <- detectSupportedMediaType(mediaType, bytes)
  yield detectedMediaType

private def detectSupportedMediaType(
    mediaType: Option[String],
    bytes: Array[Byte],
): Either[String, SupportedImageType] =
  val normalized = mediaType.flatMap(SupportedImageType.fromMediaType)
  if isJpeg(bytes) then Right(SupportedImageType.Jpeg)
  else if isPng(bytes) then Right(SupportedImageType.Png)
  else if isGif(bytes) then Right(SupportedImageType.Gif)
  else if isWebp(bytes) then Right(SupportedImageType.Webp)
  else
    normalized match
      case Some(imageType) => Right(imageType)
      case None => Left(UploadDefaults.UnsupportedImageMessage)

private def resolveExtension(
    originalFilename: Option[String],
    imageType: SupportedImageType,
): String =
  extensionFromFilename(originalFilename)
    .filter(isAllowedExtension)
    .getOrElse(imageType.defaultExtension)

private def extensionFromFilename(originalFilename: Option[String]): Option[String] =
  originalFilename
    .map(_.trim)
    .filter(_.nonEmpty)
    .flatMap { filename =>
      val lastDotIndex = filename.lastIndexOf('.')
      if lastDotIndex >= 0 && lastDotIndex < filename.length - 1 then
        Some(filename.substring(lastDotIndex + 1).toLowerCase)
      else None
    }

private def isAllowedExtension(extension: String): Boolean =
  UploadDefaults.AllowedExtensions.contains(extension)

private def isJpeg(bytes: Array[Byte]): Boolean =
  bytes.length >= 3 &&
    bytes(0) == 0xff.toByte &&
    bytes(1) == 0xd8.toByte &&
    bytes(2) == 0xff.toByte

private def isPng(bytes: Array[Byte]): Boolean =
  bytes.length >= 8 &&
    bytes(0) == 0x89.toByte &&
    bytes(1) == 0x50.toByte &&
    bytes(2) == 0x4e.toByte &&
    bytes(3) == 0x47.toByte &&
    bytes(4) == 0x0d.toByte &&
    bytes(5) == 0x0a.toByte &&
    bytes(6) == 0x1a.toByte &&
    bytes(7) == 0x0a.toByte

private def isGif(bytes: Array[Byte]): Boolean =
  bytes.length >= 6 &&
    bytes(0) == 0x47.toByte &&
    bytes(1) == 0x49.toByte &&
    bytes(2) == 0x46.toByte &&
    bytes(3) == 0x38.toByte &&
    (bytes(4) == 0x37.toByte || bytes(4) == 0x39.toByte) &&
    bytes(5) == 0x61.toByte

private def isWebp(bytes: Array[Byte]): Boolean =
  bytes.length >= 12 &&
    bytes(0) == 0x52.toByte &&
    bytes(1) == 0x49.toByte &&
    bytes(2) == 0x46.toByte &&
    bytes(3) == 0x46.toByte &&
    bytes(8) == 0x57.toByte &&
    bytes(9) == 0x45.toByte &&
    bytes(10) == 0x42.toByte &&
    bytes(11) == 0x50.toByte
