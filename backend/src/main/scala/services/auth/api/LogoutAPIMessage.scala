package services.auth.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import system.api.*

val logoutApi: FixedMethodApi[NoPathParams, Unit] =
  jsonPostApi[Unit, Unit](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("logout"),
  )
