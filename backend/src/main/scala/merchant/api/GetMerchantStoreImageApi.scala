package merchant.api

import domain.shared.given

import cats.effect.IO
import domain.shared.FileNameText
import fs2.io.file.Path as Fs2Path
import merchant.app.resolveMerchantStoreImagePath
import org.http4s.HttpRoutes
import org.http4s.StaticFile
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import shared.api.routing.*

val getMerchantStoreImageApi: FixedMethodApi1[FileNameText, Unit] =
  jsonGetApi1[FileNameText, Unit](
    List(routeSegment("uploads"), routeSegment("store-images")),
  )
