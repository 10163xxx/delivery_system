package services.merchant.api

import domain.shared.given

import domain.shared.FileNameText
import system.api.*

val getMerchantStoreImageApi: FixedMethodApi1[FileNameText, Unit] =
  jsonGetApi1[FileNameText, Unit](
    List(routeSegment("uploads"), routeSegment("store-images")),
  )
