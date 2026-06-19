package services.auth.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.auth.objects.{AuthSession}
import services.auth.objects.apiTypes.{LoginRequest}
import system.api.*

val loginApi: FixedMethodApi[NoPathParams, AuthSession] =
  jsonPostApi[LoginRequest, AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("login"),
  )
