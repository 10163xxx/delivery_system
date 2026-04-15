package shared.infra.uploads

import domain.shared.given

import cats.effect.IO
import domain.merchant.ImageUploadResponse
import domain.shared.*

import java.nio.file.{Files, Path, StandardOpenOption}
import java.util.UUID

private enum SupportedImageType(val mediaType: MediaTypeText, val defaultExtension: FileExtension):
  case Jpeg extends SupportedImageType(UploadDefaults.JpegMediaType, UploadDefaults.JpgExtension)
  case Png extends SupportedImageType(UploadDefaults.PngMediaType, UploadDefaults.PngExtension)
  case Gif extends SupportedImageType(UploadDefaults.GifMediaType, UploadDefaults.GifExtension)
  case Webp extends SupportedImageType(UploadDefaults.WebpMediaType, UploadDefaults.WebpExtension)

private val supportedImageTypeAliases: Map[MediaTypeText, SupportedImageType] = Map(
  SupportedImageType.Jpeg.mediaType -> SupportedImageType.Jpeg,
  UploadDefaults.JpgMediaType -> SupportedImageType.Jpeg,
  SupportedImageType.Png.mediaType -> SupportedImageType.Png,
  SupportedImageType.Gif.mediaType -> SupportedImageType.Gif,
  SupportedImageType.Webp.mediaType -> SupportedImageType.Webp,
)

private val jpegSignature: Vector[Byte] = Vector(0xff.toByte, 0xd8.toByte, 0xff.toByte)
private val pngSignature: Vector[Byte] =
  Vector(0x89.toByte, 0x50.toByte, 0x4e.toByte, 0x47.toByte, 0x0d.toByte, 0x0a.toByte, 0x1a.toByte, 0x0a.toByte)
private val gif87aSignature: Vector[Byte] = Vector(0x47.toByte, 0x49.toByte, 0x46.toByte, 0x38.toByte, 0x37.toByte, 0x61.toByte)
private val gif89aSignature: Vector[Byte] = Vector(0x47.toByte, 0x49.toByte, 0x46.toByte, 0x38.toByte, 0x39.toByte, 0x61.toByte)
private val webpHeaderSignature: Vector[Byte] = Vector(0x52.toByte, 0x49.toByte, 0x46.toByte, 0x46.toByte)
private val webpFormatSignature: Vector[Byte] = Vector(0x57.toByte, 0x45.toByte, 0x42.toByte, 0x50.toByte)
private val webpFormatOffset: EntityCount = 8
private val noExtensionIndex: EntityCount = -1

private def supportedImageTypeFromMediaType(value: MediaTypeText): Option[SupportedImageType] =
  supportedImageTypeAliases.get(new MediaTypeText(value.raw.toLowerCase))

def saveStoreImage(
    originalFilename: Option[FileNameText],
    mediaType: Option[MediaTypeText],
    bytes: Array[Byte],
): IO[Either[ErrorMessage, ImageUploadResponse]] =
  IO.blocking {
    validateImage(mediaType, bytes).map { imageType =>
      Files.createDirectories(UploadDefaults.UploadRoot)
      val extension = resolveExtension(originalFilename, imageType)
      val generatedName = UploadDefaults.generatedFileName(new FileNameText(UUID.randomUUID().toString), extension)
      val targetPath = UploadDefaults.UploadRoot.resolve(generatedName.raw).normalize()
      Files.write(
        targetPath,
        bytes,
        StandardOpenOption.CREATE_NEW,
        StandardOpenOption.WRITE,
      )
      ImageUploadResponse(url = UploadDefaults.publicUrlFor(generatedName))
    }
  }

def resolveStoreImagePath(filename: FileNameText): Option[Path] =
  val sanitized = filename.raw.trim
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
    mediaType: Option[MediaTypeText],
    bytes: Array[Byte],
): Either[ErrorMessage, SupportedImageType] =
  for
    _ <- Either.cond(bytes.nonEmpty, (), UploadDefaults.EmptyUploadMessage)
    _ <- Either.cond(bytes.length <= UploadDefaults.MaxUploadBytes, (), UploadDefaults.OversizedUploadMessage)
    detectedMediaType <- detectSupportedMediaType(mediaType, bytes)
  yield detectedMediaType

private def detectSupportedMediaType(
    mediaType: Option[MediaTypeText],
    bytes: Array[Byte],
): Either[ErrorMessage, SupportedImageType] =
  val normalized = mediaType.flatMap(supportedImageTypeFromMediaType)
  if isJpeg(bytes) then Right(SupportedImageType.Jpeg)
  else if isPng(bytes) then Right(SupportedImageType.Png)
  else if isGif(bytes) then Right(SupportedImageType.Gif)
  else if isWebp(bytes) then Right(SupportedImageType.Webp)
  else
    normalized match
      case Some(imageType) => Right(imageType)
      case None => Left(UploadDefaults.UnsupportedImageMessage)

private def resolveExtension(
    originalFilename: Option[FileNameText],
    imageType: SupportedImageType,
): FileExtension =
  extensionFromFilename(originalFilename)
    .filter(isAllowedExtension)
    .getOrElse(imageType.defaultExtension)

private def extensionFromFilename(originalFilename: Option[FileNameText]): Option[FileExtension] =
  originalFilename
    .map(value => value.raw.trim)
    .filter(_.nonEmpty)
    .flatMap { filename =>
      val lastDotIndex = filename.lastIndexOf('.')
      if lastDotIndex > noExtensionIndex && lastDotIndex < filename.length - NumericDefaults.SingleItemCount then
        Some(new FileExtension(filename.substring(lastDotIndex + 1).toLowerCase))
      else None
    }

private def isAllowedExtension(extension: FileExtension): ApprovalFlag =
  UploadDefaults.AllowedExtensions.contains(extension)

private def isJpeg(bytes: Array[Byte]): ApprovalFlag =
  hasSignature(bytes, jpegSignature)

private def isPng(bytes: Array[Byte]): ApprovalFlag =
  hasSignature(bytes, pngSignature)

private def isGif(bytes: Array[Byte]): ApprovalFlag =
  hasSignature(bytes, gif87aSignature) || hasSignature(bytes, gif89aSignature)

private def isWebp(bytes: Array[Byte]): ApprovalFlag =
  hasSignature(bytes, webpHeaderSignature) && hasSignature(bytes, webpFormatSignature, webpFormatOffset)

private def hasSignature(
    bytes: Array[Byte],
    signature: Vector[Byte],
    offset: EntityCount = NumericDefaults.ZeroCount,
): ApprovalFlag =
  bytes.length >= offset + signature.length &&
    signature.zipWithIndex.forall { case (expectedByte, signatureIndex) =>
      bytes(offset + signatureIndex) == expectedByte
    }
