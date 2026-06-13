package system.api.health

import domain.shared.given

import domain.shared.HealthResponse
import system.api.*

val healthApi: FixedMethodApi0[HealthResponse] =
  jsonGetApi0[HealthResponse](
    routeSegment("api"),
    routeSegment("health"),
  )
