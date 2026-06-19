package services.auth.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.auth.objects.AuthSession
import io.circe.syntax.*
import system.api.*

val getSessionApi: FixedMethodApi[NoPathParams, AuthSession] =
  jsonGetApi[AuthSession](
    routeSegment("api"),
    routeSegment("auth"),
    routeSegment("session"),
  )
