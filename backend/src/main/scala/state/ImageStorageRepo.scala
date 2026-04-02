package state

import cats.effect.IO
import objects.ImageUploadResponse

import java.nio.file.{Files, Path, Paths, StandardOpenOption}
import java.util.UUID

object ImageStorageRepo:

  private val maxUploadBytes = 5 * 1024 * 1024
  private val uploadRoot = Paths.get("uploads", "store-images")

  def saveStoreImage(
      originalFilename: Option[String],
      mediaType: Option[String],
      bytes: Array[Byte],
  ): IO[Either[String, ImageUploadResponse]] =
    IO.blocking {
      validateImage(mediaType, bytes).map { detectedMediaType =>
        Files.createDirectories(uploadRoot)
        val extension = resolveExtension(originalFilename, detectedMediaType)
        val generatedName = s"${UUID.randomUUID().toString}.$extension"
        val targetPath = uploadRoot.resolve(generatedName).normalize()
        Files.write(
          targetPath,
          bytes,
          StandardOpenOption.CREATE_NEW,
          StandardOpenOption.WRITE,
        )
        ImageUploadResponse(url = s"/uploads/store-images/$generatedName")
      }
    }

  def resolveStoreImagePath(filename: String): Option[Path] =
    val sanitized = filename.trim
    val candidate = uploadRoot.resolve(sanitized).normalize()
    if
      sanitized.nonEmpty &&
      !sanitized.contains("/") &&
      !sanitized.contains("\\") &&
      candidate.startsWith(uploadRoot.normalize()) &&
      Files.exists(candidate) &&
      Files.isRegularFile(candidate)
    then Some(candidate)
    else None

  private def validateImage(
      mediaType: Option[String],
      bytes: Array[Byte],
  ): Either[String, String] =
    for
      _ <- Either.cond(bytes.nonEmpty, (), "请选择要上传的图片")
      _ <- Either.cond(bytes.length <= maxUploadBytes, (), "图片大小不能超过 5MB")
      detectedMediaType <- detectSupportedMediaType(mediaType, bytes)
    yield detectedMediaType

  private def detectSupportedMediaType(
      mediaType: Option[String],
      bytes: Array[Byte],
  ): Either[String, String] =
    val normalized = mediaType.map(_.toLowerCase)
    if isJpeg(bytes) then Right("image/jpeg")
    else if isPng(bytes) then Right("image/png")
    else if isGif(bytes) then Right("image/gif")
    else if isWebp(bytes) then Right("image/webp")
    else
      normalized match
        case Some("image/jpeg") | Some("image/jpg") => Right("image/jpeg")
        case Some("image/png") => Right("image/png")
        case Some("image/gif") => Right("image/gif")
        case Some("image/webp") => Right("image/webp")
        case _ => Left("仅支持 JPG、PNG、GIF、WebP 图片")

  private def resolveExtension(
      originalFilename: Option[String],
      mediaType: String,
  ): String =
    extensionFromFilename(originalFilename)
      .filter(isAllowedExtension)
      .getOrElse(extensionFromMediaType(mediaType))

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

  private def extensionFromMediaType(mediaType: String): String =
    mediaType match
      case "image/jpeg" => "jpg"
      case "image/png" => "png"
      case "image/gif" => "gif"
      case "image/webp" => "webp"
      case _ => "img"

  private def isAllowedExtension(extension: String): Boolean =
    Set("jpg", "jpeg", "png", "gif", "webp").contains(extension)

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
