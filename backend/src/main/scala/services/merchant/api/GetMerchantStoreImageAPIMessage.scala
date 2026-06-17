package services.merchant.api

import domain.shared.given

import domain.shared.FileNameText
import system.api.*

val getMerchantStoreImageApi: FixedMethodApi[PathParam[FileNameText], Unit] =
  jsonGetApi[FileNameText, Unit](
    List(routeSegment("uploads"), routeSegment("store-images")),
  )
