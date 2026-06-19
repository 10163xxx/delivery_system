package services.merchant.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import system.objects.FileNameText
import system.api.*

val getMerchantStoreImageApi: FixedMethodApi[PathParam[FileNameText], Unit] =
  jsonGetApi[FileNameText, Unit](
    List(routeSegment("uploads"), routeSegment("store-images")),
  )
