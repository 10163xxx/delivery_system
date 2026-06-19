package services.merchant.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.merchant.api.*
import services.auth.objects.*

import system.objects.given

import cats.effect.IO
import services.merchant.objects.apiTypes.ImageUploadResponse
import system.objects.*
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import org.http4s.headers.`Content-Type`
import org.http4s.multipart.Multipart
import system.api.*

val uploadMerchantStoreImageRoute: HttpRoutes[IO] = apiRoute(uploadMerchantStoreImageApi) { matchedReq =>
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
