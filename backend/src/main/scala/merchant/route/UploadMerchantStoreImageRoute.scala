package merchant.route

import merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.ImageUploadResponse
import domain.shared.*
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import org.http4s.headers.`Content-Type`
import org.http4s.multipart.Multipart
import shared.api.routing.*

val uploadMerchantStoreImageRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(uploadMerchantStoreImageApi, req) =>
    val Some(matchedReq) = extractApi0(uploadMerchantStoreImageApi, req)
    withRole(matchedReq, UserRole.merchant) { _ =>
      matchedReq.as[Multipart[IO]].flatMap { multipart =>
        multipart.parts.find(_.name.contains(UploadDefaults.MultipartFileField.raw)) match
          case Some(filePart) =>
            filePart.body.compile.to(Array).flatMap { bytes =>
              val mediaType = filePart.headers.get[`Content-Type`].map(_.mediaType.toString)
              saveMerchantStoreImage(
                filePart.filename.map(fileNameText),
                mediaType.map(mediaTypeText),
                bytes,
              ).flatMap(handleUploadResult)
            }
          case None => BadRequest(missingMultipartFile(UploadDefaults.MultipartFileField))
      }
    }
}
