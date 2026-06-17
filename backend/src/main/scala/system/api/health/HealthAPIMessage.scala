package system.api.health

import domain.shared.given

import system.objects.HealthResponse
import system.api.*

val healthApi: FixedMethodApi[NoPathParams, HealthResponse] =
  jsonGetApi[HealthResponse](
    routeSegment("api"),
    routeSegment("health"),
  )
