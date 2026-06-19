package system.api.health

import system.objects.given

import system.objects.HealthResponse
import system.api.*

val healthApi: FixedMethodApi[NoPathParams, HealthResponse] =
  jsonGetApi[HealthResponse](
    routeSegment("api"),
    routeSegment("health"),
  )
